"use server";

import { count, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import {
  beginCurrentAdminPasswordChange,
  beginAdminEmailVerification,
  beginAdminPasswordResetVerification,
  completeCurrentAdminPasswordChange,
  requireAuth,
  validateAdminIdentity,
  verifyAdminEmail,
  verifyAdminPasswordReset,
} from "@/lib/auth";

const PROFILE_PATH = "/admin/profile-settings";

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

function parsePreferences(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return {
      success: false as const,
      error: "Preferences must be valid JSON.",
    };
  }
  if (value.length > 16_384) {
    return {
      success: false as const,
      error: "Preferences must be 16 KB or smaller.",
    };
  }

  try {
    const preferences: unknown = JSON.parse(value);
    if (
      typeof preferences !== "object" ||
      preferences === null ||
      Array.isArray(preferences)
    ) {
      return {
        success: false as const,
        error: "Preferences must be a JSON object.",
      };
    }
    return {
      success: true as const,
      preferences: preferences as Record<string, unknown>,
    };
  } catch {
    return {
      success: false as const,
      error: "Preferences must be valid JSON.",
    };
  }
}

export async function getProfileSettings() {
  const identity = await requireAuth();
  const [profile] = await db
    .select({
      displayName: schema.adminProfiles.displayName,
      bio: schema.adminProfiles.bio,
      preferences: schema.adminProfiles.preferences,
    })
    .from(schema.adminProfiles)
    .where(eq(schema.adminProfiles.userId, identity.id))
    .limit(1);
  if (!profile) {
    throw new Error("Admin profile is missing for the authenticated account.");
  }

  const admins = await db
    .select({
      id: schema.adminUsers.id,
      email: schema.adminUsers.email,
      displayName: schema.adminProfiles.displayName,
      isActive: schema.adminUsers.isActive,
      createdAt: schema.adminUsers.createdAt,
    })
    .from(schema.adminUsers)
    .innerJoin(
      schema.adminProfiles,
      eq(schema.adminProfiles.userId, schema.adminUsers.id),
    )
    .orderBy(schema.adminUsers.createdAt);

  return { admin: { ...identity, ...profile }, admins };
}

export async function updateMyProfile(formData: FormData) {
  const admin = await requireAuth();
  const emailValue = formData.get("email");
  const displayNameValue = formData.get("displayName");
  const bioValue = formData.get("bio");
  const preferencesValue = parsePreferences(formData.get("preferences"));

  if (
    typeof emailValue !== "string" ||
    typeof displayNameValue !== "string" ||
    typeof bioValue !== "string"
  ) {
    return { success: false as const, error: "Invalid profile data." };
  }

  const validated = validateAdminIdentity(emailValue, displayNameValue);
  if (!validated.success) return validated;
  if (!preferencesValue.success) return preferencesValue;
  if (bioValue.length > 2000) {
    return {
      success: false as const,
      error: "Bio must be 2,000 characters or fewer.",
    };
  }

  try {
    await db.transaction(async (transaction) => {
      await transaction
        .update(schema.adminUsers)
        .set({ email: validated.email, updatedAt: new Date() })
        .where(eq(schema.adminUsers.id, admin.id));

      await transaction
        .update(schema.adminProfiles)
        .set({
          displayName: validated.displayName,
          bio: bioValue.trim() || null,
          preferences: preferencesValue.preferences,
          updatedAt: new Date(),
        })
        .where(eq(schema.adminProfiles.userId, admin.id));
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        success: false as const,
        error: "An account with that email already exists.",
      };
    }
    throw error;
  }

  revalidatePath(PROFILE_PATH);
  return { success: true as const };
}

export async function changeMyPassword(formData: FormData) {
  await requireAuth();
  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return { success: false as const, error: "Invalid password data." };
  }

  const result = await beginCurrentAdminPasswordChange(
    currentPassword,
    newPassword,
  );
  return result;
}

export async function completeMyPasswordChange(
  challengeId: string,
  code: string,
) {
  await requireAuth();
  const result = await completeCurrentAdminPasswordChange(challengeId, code);
  if (result.success) revalidatePath(PROFILE_PATH);
  return result;
}

export async function beginAdminUserEmailVerification(formData: FormData) {
  await requireAuth();
  const email = formData.get("email");
  const displayName = formData.get("displayName");
  const password = formData.get("password");
  if (
    typeof email !== "string" ||
    typeof displayName !== "string" ||
    typeof password !== "string"
  ) {
    return { success: false as const, error: "Invalid account data." };
  }

  const result = await beginAdminEmailVerification(
    email,
    displayName,
    password,
    "additional",
  );
  if (!result.success) return result;
  return { success: true as const, challengeId: result.challengeId };
}

export async function completeAdminUserEmailVerification(
  challengeId: string,
  code: string,
) {
  await requireAuth();
  let result: Awaited<ReturnType<typeof verifyAdminEmail>>;
  try {
    result = await verifyAdminEmail(challengeId, code, "additional");
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        success: false as const,
        error: "An account with that email already exists.",
      };
    }
    throw error;
  }
  if (!result.success) return result;

  revalidatePath(PROFILE_PATH);
  return { success: true as const };
}

export async function setAdminUserActive(formData: FormData) {
  const currentAdmin = await requireAuth();
  const idValue = Number(formData.get("userId"));
  const activeValue = formData.get("active");
  if (
    !Number.isSafeInteger(idValue) ||
    idValue < 1 ||
    !["true", "false"].includes(String(activeValue))
  ) {
    return { success: false as const, error: "Invalid account selection." };
  }
  if (idValue === currentAdmin.id && activeValue === "false") {
    return {
      success: false as const,
      error: "You cannot deactivate your own account.",
    };
  }

  const active = activeValue === "true";
  let result: "last-admin" | "not-found" | "updated";
  try {
    result = await db.transaction(async (transaction) => {
      await transaction.execute(sql`SELECT pg_advisory_xact_lock(735241, 2)`);
      if (!active) {
        const [activeAdmins] = await transaction
          .select({ value: count() })
          .from(schema.adminUsers)
          .where(eq(schema.adminUsers.isActive, true));
        if (activeAdmins.value <= 1) return "last-admin" as const;
      }

      const [updated] = await transaction
        .update(schema.adminUsers)
        .set({ isActive: active, updatedAt: new Date() })
        .where(eq(schema.adminUsers.id, idValue))
        .returning({ id: schema.adminUsers.id });
      if (!updated) return "not-found" as const;

      if (!active) {
        await transaction
          .delete(schema.adminSessions)
          .where(eq(schema.adminSessions.userId, idValue));
      }
      return "updated" as const;
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        success: false as const,
        error: "An account with that email already exists.",
      };
    }
    throw error;
  }

  if (result === "last-admin") {
    return {
      success: false as const,
      error: "The last active admin account cannot be deactivated.",
    };
  }
  if (result === "not-found") {
    return { success: false as const, error: "Admin account was not found." };
  }
  revalidatePath(PROFILE_PATH);
  return { success: true as const };
}

export async function beginAdminUserPasswordReset(formData: FormData) {
  const currentAdmin = await requireAuth();
  const idValue = Number(formData.get("userId"));
  const passwordValue = formData.get("password");
  if (
    !Number.isSafeInteger(idValue) ||
    idValue < 1 ||
    typeof passwordValue !== "string" ||
    passwordValue.length < 12 ||
    passwordValue.length > 256
  ) {
    return {
      success: false as const,
      error: "Choose a password between 12 and 256 characters.",
    };
  }
  if (idValue === currentAdmin.id) {
    return {
      success: false as const,
      error: "Use Change Password to update your own password.",
    };
  }

  const result = await beginAdminPasswordResetVerification(
    idValue,
    passwordValue,
    currentAdmin,
  );
  return result;
}

export async function completeAdminUserPasswordReset(
  challengeId: string,
  code: string,
) {
  const currentAdmin = await requireAuth();
  const result = await verifyAdminPasswordReset(
    challengeId,
    code,
    currentAdmin,
  );
  if (!result.success) return result;

  revalidatePath(PROFILE_PATH);
  return { success: true as const };
}
