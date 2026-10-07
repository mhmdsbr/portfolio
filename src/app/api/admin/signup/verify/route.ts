import { verifyAdminEmail } from "@/lib/auth";
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
    !("challengeId" in body) ||
    typeof body.challengeId !== "string" ||
    !("code" in body) ||
    typeof body.code !== "string"
  ) {
    return NextResponse.json(
      { error: "A verification code is required." },
      { status: 400 },
    );
  }

  const result = await verifyAdminEmail(body.challengeId, body.code, "initial");
  if (result.success) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const status = result.error === "Initial sign-up is closed." ? 409 : 422;
  return NextResponse.json({ error: result.error }, { status });
}
