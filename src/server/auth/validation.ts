export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function validateAdminEmail(email: string) {
  const normalizedEmail = normalizeEmail(email)

  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    return { success: false as const, error: 'Enter a valid email address.' }
  }

  return { success: true as const, email: normalizedEmail }
}

export function validateAdminIdentity(email: string, displayName: string) {
  const validatedEmail = validateAdminEmail(email)
  const normalizedName = displayName.trim()

  if (!validatedEmail.success) return validatedEmail
  if (!normalizedName || normalizedName.length > 100) {
    return {
      success: false as const,
      error: 'Name is required and must be 100 characters or fewer.',
    }
  }
  return {
    success: true as const,
    email: validatedEmail.email,
    displayName: normalizedName,
  }
}

export function validateAdminInput({
  email,
  displayName,
  password,
}: {
  email: string
  displayName: string
  password: string
}) {
  const identity = validateAdminIdentity(email, displayName)
  if (!identity.success) return identity

  if (password.length < 12 || password.length > 256) {
    return {
      success: false as const,
      error: 'Password must be between 12 and 256 characters.',
    }
  }

  return identity
}
