import nodemailer from "nodemailer";

export class EmailVerificationDeliveryError extends Error {}

export async function sendAdminEmailVerification(
  email: string,
  code: string,
  purpose: "account" | "password-reset" | "password-change" = "account",
) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env;
  const port = Number(SMTP_PORT);
  if (
    !SMTP_HOST ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !SMTP_USERNAME ||
    !SMTP_PASSWORD
  ) {
    throw new EmailVerificationDeliveryError(
      "Configure SMTP_HOST, SMTP_PORT, SMTP_USERNAME, and SMTP_PASSWORD in the server environment.",
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
    requireTLS: port !== 465,
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });


  try {

    const subject = {
      account: "Your admin account verification code",
      "password-reset": "Your admin password reset code",
      "password-change": "Your admin password change verification code",
    }[purpose];
    const description = {
      account: "portfolio account verification",
      "password-reset": "password reset",
      "password-change": "password change verification",
    }[purpose];
    await transporter.sendMail({
      from: SMTP_USERNAME,
      to: email,
      subject,
      text: `Your ${description} code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
      html: `<p>Your ${description} code:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>`,
    });
  } catch (error) {
    throw new EmailVerificationDeliveryError("SMTP delivery failed.", {
      cause: error,
    });
  }
}
