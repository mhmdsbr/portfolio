import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export class EmailVerificationDeliveryError extends Error {}

export async function sendAdminEmailVerification(email: string, code: string) {
  const [config] = await db
    .select({
      host: schema.config.smtpHost,
      port: schema.config.smtpPort,
      username: schema.config.smtpUsername,
      password: schema.config.smtpPassword,
    })
    .from(schema.config)
    .limit(1);

  const port = Number(config?.port);
  if (
    !config?.host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !config.username ||
    !config.password
  ) {
    throw new EmailVerificationDeliveryError(
      "Configure a valid SMTP host, port, username, and password in General Settings.",
    );
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port,
    secure: port === 465,
    auth: {
      user: config.username,
      pass: config.password,
    },
    requireTLS: port !== 465,
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    await transporter.sendMail({
      from: config.username,
      to: email,
      subject: "Your admin account verification code",
      text: `Your verification code for your portfolio account is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
      html: `<p>Your verification code for your portfolio account:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>`,
    });
  } catch (error) {
    throw new EmailVerificationDeliveryError("SMTP delivery failed.", {
      cause: error,
    });
  }
}
