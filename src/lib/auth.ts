import { cookies } from "next/headers";
import {
  createHash,
  randomBytes,
  randomInt,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { redirect } from "next/navigation";
import { and, count, eq, gt, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import {
  EmailVerificationDeliveryError,
  sendAdminEmailVerification,
} from "@/lib/email";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const SCRYPT_COST = 32768;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_MAX_MEMORY = 64 * 1024 * 1024;
const VERIFICATION_DURATION_MS = 10 * 60 * 1000;
const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_VERIFICATION_ATTEMPTS = 5;

function derivePasswordKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      SCRYPT_KEY_LENGTH,
      {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELIZATION,
        maxmem: SCRYPT_MAX_MEMORY,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
        } else {
          resolve(derivedKey);
        }
      },
    );
  });
}

export interface CurrentAdmin {
  id: number;
  email: string;
}

export interface CurrentAdminProfile extends CurrentAdmin {
  displayName: string;
  bio: string | null;
  preferences: Record<string, unknown>;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateAdminIdentity(email: string, displayName: string) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedName = displayName.trim();

  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    return { success: false as const, error: "Enter a valid email address." };
  }
  if (!normalizedName || normalizedName.length > 100) {
    return {
      success: false as const,
      error: "Name is required and must be 100 characters or fewer.",
    };
  }
  return {
    success: true as const,
    email: normalizedEmail,
    displayName: normalizedName,
  };
}

export function validateAdminInput({
  email,
  displayName,
  password,
}: {
  email: string;
  displayName: string;
  password: string;
}) {
  const identity = validateAdminIdentity(email, displayName);
  if (!identity.success) return identity;

  if (password.length < 12 || password.length > 256) {
    return {
      success: false as const,
      error: "Password must be between 12 and 256 characters.",
    };
  }

  return identity;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = await derivePasswordKey(password, salt);

  return `scrypt$${SCRYPT_COST}$${SCRYPT_BLOCK_SIZE}$${SCRYPT_PARALLELIZATION}$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  if (password.length > 256) return false;

  const [algorithm, cost, blockSize, parallelization, encodedSalt, encodedKey] =
    storedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    cost !== String(SCRYPT_COST) ||
    blockSize !== String(SCRYPT_BLOCK_SIZE) ||
    parallelization !== String(SCRYPT_PARALLELIZATION) ||
    !encodedSalt ||
    !encodedKey
  ) {
    return false;
  }

  const salt = Buffer.from(encodedSalt, "base64url");
  const expectedKey = Buffer.from(encodedKey, "base64url");
  if (salt.length !== 16 || expectedKey.length !== SCRYPT_KEY_LENGTH) {
    return false;
  }

  const actualKey = await derivePasswordKey(password, salt);

  return timingSafeEqual(actualKey, expectedKey);
}

async function createSession(userId: number) {
  const sessionId = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  await db
    .insert(schema.adminSessions)
    .values({ sessionId: hashSessionId(sessionId), userId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getAdminCount() {
  await db
    .delete(schema.adminEmailVerifications)
    .where(lt(schema.adminEmailVerifications.expiresAt, new Date()));
  const [result] = await db.select({ value: count() }).from(schema.adminUsers);
  return result.value;
}

export async function beginAdminEmailVerification(
  email: string,
  displayName: string,
  password: string,
  purpose: "initial" | "additional",
) {
  const validated = validateAdminInput({ email, displayName, password });
  if (!validated.success) return validated;

  const currentAdmin =
    purpose === "additional" ? await getSessionAdmin() : null;
  if (purpose === "additional" && !currentAdmin) {
    return { success: false as const, error: "Sign in to add an admin." };
  }
  if (purpose === "initial" && (await getAdminCount()) > 0) {
    return { success: false as const, error: "Initial sign-up is closed." };
  }
  const [existingUser] = await db
    .select({ id: schema.adminUsers.id })
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, validated.email))
    .limit(1);
  if (existingUser) {
    return {
      success: false as const,
      error: "An account with that email already exists.",
    };
  }

  const now = new Date();

  const reservation = await db.transaction(async (transaction) => {
    await transaction.execute(
      purpose === "initial"
        ? sql`SELECT pg_advisory_xact_lock(735241, 1)`
        : sql`SELECT pg_advisory_xact_lock(735241, hashtext(${validated.email}))`,
    );
    await transaction
      .delete(schema.adminEmailVerifications)
      .where(lt(schema.adminEmailVerifications.expiresAt, now));
    const [registeredEmail] = await transaction
      .select({ id: schema.adminUsers.id })
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, validated.email))
      .limit(1);
    if (registeredEmail) return "duplicate" as const;

    const [recentChallenge] = await transaction
      .select({ createdAt: schema.adminEmailVerifications.createdAt })
      .from(schema.adminEmailVerifications)
      .where(
        purpose === "initial"
          ? and(
              eq(schema.adminEmailVerifications.purpose, purpose),
              gt(
                schema.adminEmailVerifications.expiresAt,
                new Date(now.getTime() - VERIFICATION_RESEND_COOLDOWN_MS),
              ),
            )
          : and(
              eq(schema.adminEmailVerifications.email, validated.email),
              eq(schema.adminEmailVerifications.purpose, purpose),
              gt(
                schema.adminEmailVerifications.expiresAt,
                new Date(now.getTime() - VERIFICATION_RESEND_COOLDOWN_MS),
              ),
            ),
      )
      .limit(1);
    if (
      recentChallenge?.createdAt &&
      now.getTime() - recentChallenge.createdAt.getTime() <
        VERIFICATION_RESEND_COOLDOWN_MS
    ) {
      return "cooldown" as const;
    }

    await transaction
      .delete(schema.adminEmailVerifications)
      .where(
        purpose === "initial"
          ? eq(schema.adminEmailVerifications.purpose, purpose)
          : and(
              eq(schema.adminEmailVerifications.email, validated.email),
              eq(schema.adminEmailVerifications.purpose, purpose),
            ),
      );
    if (purpose === "initial") {
      const [existing] = await transaction
        .select({ value: count() })
        .from(schema.adminUsers);
      if (existing.value > 0) return "closed" as const;
    } else {
      const [activeAdmin] = await transaction
        .select({ id: schema.adminUsers.id })
        .from(schema.adminUsers)
        .where(
          and(
            eq(schema.adminUsers.id, currentAdmin!.id),
            eq(schema.adminUsers.isActive, true),
          ),
        )
        .limit(1);
      if (!activeAdmin) return "unauthorized" as const;
    }

    const code = String(randomInt(100_000, 1_000_000));
    const codeSalt = randomBytes(16);
    const codeHash = await derivePasswordKey(code, codeSalt);
    const passwordHash = await hashPassword(password);
    const challengeId = randomBytes(32).toString("base64url");
    await transaction.insert(schema.adminEmailVerifications).values({
      id: challengeId,
      purpose,
      email: validated.email,
      displayName: validated.displayName,
      passwordHash,
      codeSalt: codeSalt.toString("base64url"),
      codeHash: codeHash.toString("base64url"),
      createdByUserId: currentAdmin?.id ?? null,
      expiresAt: new Date(now.getTime() + VERIFICATION_DURATION_MS),
    });
    return { status: "created" as const, challengeId, code };
  });

  if (reservation === "cooldown") {
    return {
      success: false as const,
      error: "Please wait one minute before requesting another code.",
    };
  }
  if (reservation === "closed") {
    return { success: false as const, error: "Initial sign-up is closed." };
  }
  if (reservation === "unauthorized") {
    return { success: false as const, error: "Sign in to add an admin." };
  }
  if (reservation === "duplicate") {
    return {
      success: false as const,
      error: "An account with that email already exists.",
    };
  }
  if (typeof reservation === "string") {
    return {
      success: false as const,
      error: "Could not start email verification.",
    };
  }

  try {
    await sendAdminEmailVerification(validated.email, reservation.code);
  } catch (error) {
    if (!(error instanceof EmailVerificationDeliveryError)) throw error;
    console.error("Failed to send admin verification email:", error.message);
    return {
      success: false as const,
      error:
        "Could not send the verification email. Check SMTP settings in General Settings.",
    };
  }

  return { success: true as const, challengeId: reservation.challengeId };
}

export async function verifyAdminEmail(
  challengeId: string,
  code: string,
  purpose: "initial" | "additional",
) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(challengeId) || !/^\d{6}$/.test(code)) {
    return { success: false as const, error: "Invalid or expired code." };
  }

  const currentAdmin =
    purpose === "additional" ? await getSessionAdmin() : null;
  if (purpose === "additional" && !currentAdmin) {
    return { success: false as const, error: "Sign in to add an admin." };
  }

  const result = await db.transaction(async (transaction) => {
    await transaction.execute(
      sql`SELECT pg_advisory_xact_lock(735242, hashtext(${challengeId}))`,
    );
    const [challenge] = await transaction
      .select()
      .from(schema.adminEmailVerifications)
      .where(
        and(
          eq(schema.adminEmailVerifications.id, challengeId),
          eq(schema.adminEmailVerifications.purpose, purpose),
          gt(schema.adminEmailVerifications.expiresAt, new Date()),
          sql`${schema.adminEmailVerifications.attempts} < ${MAX_VERIFICATION_ATTEMPTS}`,
          purpose === "additional"
            ? eq(
                schema.adminEmailVerifications.createdByUserId,
                currentAdmin!.id,
              )
            : sql`true`,
        ),
      )
      .for("update")
      .limit(1);

    if (!challenge) return { status: "expired" as const };
    const salt = Buffer.from(challenge.codeSalt, "base64url");
    const expectedHash = Buffer.from(challenge.codeHash, "base64url");
    if (salt.length !== 16 || expectedHash.length !== SCRYPT_KEY_LENGTH) {
      return { status: "expired" as const };
    }
    const candidateHash = await derivePasswordKey(code, salt);
    if (!timingSafeEqual(candidateHash, expectedHash)) {
      const attempts = challenge.attempts + 1;
      if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
        await transaction
          .delete(schema.adminEmailVerifications)
          .where(eq(schema.adminEmailVerifications.id, challengeId));
      } else {
        await transaction
          .update(schema.adminEmailVerifications)
          .set({ attempts })
          .where(eq(schema.adminEmailVerifications.id, challengeId));
      }
      return { status: "invalid" as const };
    }

    if (purpose === "initial") {
      await transaction.execute(sql`SELECT pg_advisory_xact_lock(735241, 1)`);
      const [existing] = await transaction
        .select({ value: count() })
        .from(schema.adminUsers);
      if (existing.value > 0) {
        await transaction
          .delete(schema.adminEmailVerifications)
          .where(eq(schema.adminEmailVerifications.id, challengeId));
        return { status: "closed" as const };
      }
    } else {
      const [creator] = await transaction
        .select({ id: schema.adminUsers.id })
        .from(schema.adminUsers)
        .where(
          and(
            eq(schema.adminUsers.id, currentAdmin!.id),
            eq(schema.adminUsers.isActive, true),
          ),
        )
        .limit(1);
      if (!creator) return { status: "expired" as const };
    }

    await transaction.execute(
      sql`SELECT pg_advisory_xact_lock(735241, hashtext(${challenge.email}))`,
    );
    const [existingUser] = await transaction
      .select({ id: schema.adminUsers.id })
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, challenge.email))
      .limit(1);
    if (existingUser) {
      await transaction
        .delete(schema.adminEmailVerifications)
        .where(eq(schema.adminEmailVerifications.id, challengeId));
      return { status: "duplicate" as const };
    }

    const [user] = await transaction
      .insert(schema.adminUsers)
      .values({
        email: challenge.email,
        passwordHash: challenge.passwordHash,
      })
      .returning({ id: schema.adminUsers.id });
    await transaction.insert(schema.adminProfiles).values({
      userId: user.id,
      displayName: challenge.displayName,
      preferences: {},
    });
    await transaction
      .delete(schema.adminEmailVerifications)
      .where(eq(schema.adminEmailVerifications.id, challengeId));
    return { status: "created" as const, userId: user.id };
  });

  if (result.status === "invalid") {
    return {
      success: false as const,
      error: "Incorrect code. Check your email and try again.",
    };
  }
  if (result.status === "closed") {
    return { success: false as const, error: "Initial sign-up is closed." };
  }
  if (result.status === "duplicate") {
    return {
      success: false as const,
      error: "An account with that email already exists.",
    };
  }
  if (result.status !== "created") {
    return { success: false as const, error: "Invalid or expired code." };
  }

  if (purpose === "initial") await createSession(result.userId);
  return { success: true as const };
}

export async function changeCurrentAdminPassword(
  currentPassword: string,
  newPassword: string,
) {
  const admin = await getSessionAdmin();
  if (!admin) return { success: false as const, error: "Sign in again." };
  if (newPassword.length < 12 || newPassword.length > 256) {
    return {
      success: false as const,
      error: "New password must be between 12 and 256 characters.",
    };
  }

  const [user] = await db
    .select({ passwordHash: schema.adminUsers.passwordHash })
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.id, admin.id))
    .limit(1);

  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return { success: false as const, error: "Current password is incorrect." };
  }

  const passwordHash = await hashPassword(newPassword);
  const currentSessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  await db.transaction(async (transaction) => {
    await transaction
      .update(schema.adminUsers)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(schema.adminUsers.id, admin.id));

    await transaction
      .delete(schema.adminSessions)
      .where(
        currentSessionId
          ? and(
              eq(schema.adminSessions.userId, admin.id),
              sql`${schema.adminSessions.sessionId} <> ${hashSessionId(currentSessionId)}`,
            )
          : eq(schema.adminSessions.userId, admin.id),
      );
  });

  return { success: true as const };
}

export async function login(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const [user] = await db
    .select({
      id: schema.adminUsers.id,
      passwordHash: schema.adminUsers.passwordHash,
      isActive: schema.adminUsers.isActive,
    })
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, normalizedEmail))
    .limit(1);

  if (
    !user ||
    !user.isActive ||
    !(await verifyPassword(password, user.passwordHash))
  ) {
    return { success: false as const, error: "Invalid email or password." };
  }

  await createSession(user.id);
  return { success: true as const };
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    await db
      .delete(schema.adminSessions)
      .where(eq(schema.adminSessions.sessionId, hashSessionId(sessionId)));
  }

  cookieStore.delete(SESSION_COOKIE);
}

async function getSessionAdmin(): Promise<CurrentAdmin | null> {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const [admin] = await db
    .select({
      id: schema.adminUsers.id,
      email: schema.adminUsers.email,
    })
    .from(schema.adminSessions)
    .innerJoin(
      schema.adminUsers,
      eq(schema.adminSessions.userId, schema.adminUsers.id),
    )
    .where(
      and(
        eq(schema.adminSessions.sessionId, hashSessionId(sessionId)),
        gt(schema.adminSessions.expiresAt, new Date()),
        eq(schema.adminUsers.isActive, true),
      ),
    )
    .limit(1);

  return admin ?? null;
}

export async function isAuthenticated() {
  return (await getSessionAdmin()) !== null;
}

export async function requireAuth() {
  const admin = await getSessionAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}

export function hashSessionId(sessionId: string) {
  return createHash("sha256").update(sessionId).digest("hex");
}
