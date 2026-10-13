'use server'

import { z } from 'zod'
import { sendContactMessage, EmailDeliveryError } from '@/server/email'
import { getContactMethodsForSection } from '@/server/repos/contact-methods'

const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter your name.')
    .max(100, 'Name must be 100 characters or fewer.')
    .regex(/^[^\r\n\u0000-\u001f\u007f]+$/, 'Enter a valid name.'),
  email: z
    .string()
    .trim()
    .max(254, 'Email address is too long.')
    .email('Enter a valid email address.'),
  subject: z
    .string()
    .trim()
    .max(200, 'Subject must be 200 characters or fewer.')
    .regex(/^[^\r\n\u0000-\u001f\u007f]*$/, 'Enter a valid subject.'),
  message: z
    .string()
    .trim()
    .min(1, 'Enter a message.')
    .max(10_000, 'Message must be 10,000 characters or fewer.'),
})

export async function submitContactMessage(input: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const parsed = contactMessageSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? 'Check your message and try again.',
    }
  }

  const emailMethods = await getContactMethodsForSection('contact')
  const recipients = [
    ...new Set(
      emailMethods
        .filter((method) => method.kind === 'email')
        .map((method) => method.value.replace(/^mailto:/i, '').trim()),
    ),
  ]
  if (recipients.length === 0) {
    return {
      success: false as const,
      error: 'The contact form is not available right now.',
    }
  }
  if (recipients.some((email) => !z.email().safeParse(email).success)) {
    console.error('Public contact form has an invalid configured recipient.')
    return {
      success: false as const,
      error: 'The contact form is not available right now.',
    }
  }

  try {
    await sendContactMessage(recipients, {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      body: parsed.data.message,
    })
  } catch (error) {
    if (!(error instanceof EmailDeliveryError)) throw error
    console.error('Failed to deliver public contact message:', error.message)
    return {
      success: false as const,
      error: 'Unable to send your message right now. Please try again later.',
    }
  }

  return { success: true as const }
}
