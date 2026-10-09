import { beginAdminEmailVerification } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    typeof body.email !== "string" ||
    !("displayName" in body) ||
    typeof body.displayName !== "string" ||
    !("password" in body) ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json(
      { error: "Name, email, and password are required." },
      { status: 400 },
    );
  }

  const result = await beginAdminEmailVerification(
    body.email,
    body.displayName,
    body.password,
    "initial",
  );

  if (result.success) {
    return NextResponse.json(
      { success: true, challengeId: result.challengeId },
      { status: 200 },
    );
  }

  const status =
    result.error === "Initial sign-up is closed."
      ? 409
      : result.error.includes("wait one minute")
        ? 429
        : result.error.includes("already exists")
          ? 409
          : result.error.includes("Could not send")
            ? 503
            : 422;
  return NextResponse.json({ error: result.error }, { status });
}
