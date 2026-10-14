import nodemailer from "nodemailer";

export class EmailDeliveryError extends Error {}
export class EmailVerificationDeliveryError extends EmailDeliveryError {}

function createSmtpTransporter(ErrorType: typeof EmailDeliveryError) {
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
    throw new ErrorType(
      "Configure SMTP_HOST, SMTP_PORT, SMTP_USERNAME, and SMTP_PASSWORD in the server environment.",
    );
  }

  return nodemailer.createTransport({
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
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function sendContactMessage(
  recipients: string[],
  message: { name: string; email: string; subject: string; body: string },
) {
  const transporter = createSmtpTransporter(EmailDeliveryError);
  const { SMTP_USERNAME } = process.env;

  try {
    await transporter.sendMail({
      from: SMTP_USERNAME,
      to: recipients,
      replyTo: { name: message.name, address: message.email },
      subject: `Portfolio contact: ${message.subject || "New message"}`,
      text: [
        `From: ${message.name} <${message.email}>`,
        "",
        message.body,
      ].join("\n"),
      html: [
        `<p><strong>From:</strong> ${escapeHtml(message.name)} &lt;${escapeHtml(message.email)}&gt;</p>`,
        `<p><strong>Subject:</strong> ${escapeHtml(message.subject || "New message")}</p>`,
        `<p>${escapeHtml(message.body).replace(/\r?\n/g, "<br>")}</p>`,
      ].join(""),
    });
  } catch (error) {
    if (error instanceof EmailDeliveryError) throw error;
    throw new EmailDeliveryError("SMTP delivery failed.", { cause: error });
  }
}

export async function sendAdminEmailVerification(
  email: string,
  code: string,
  purpose: "account" | "password-reset" | "password-change" = "account",
) {
  const transporter = createSmtpTransporter(EmailVerificationDeliveryError);
  const { SMTP_USERNAME } = process.env;

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
    if (error instanceof EmailVerificationDeliveryError) throw error;
    throw new EmailVerificationDeliveryError("SMTP delivery failed.", {
      cause: error,
    });
  }
}
