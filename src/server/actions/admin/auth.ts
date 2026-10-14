'use server'

import { login, logout } from '@/server/auth/session'
import {
  beginAdminEmailVerification,
  completeSelfServiceAdminPasswordReset,
  beginSelfServiceAdminPasswordReset,
  verifyAdminEmail,
} from '@/server/services/admin-verification'
import { isUniqueViolation } from '@/server/services/shared'

export async function loginAdmin(email: string, password: string) {
  if (
    typeof email !== 'string' ||
    email.length > 254 ||
    typeof password !== 'string' ||
    password.length > 256
  ) {
    return { success: false as const, error: 'Invalid email or password.' }
  }

  return login(email, password)
}

export async function logoutAdmin() {
  await logout()
}

export async function beginInitialAdminSignup(
  displayName: string,
  email: string,
  password: string,
) {
  if (
    typeof displayName !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return { success: false as const, error: 'Name, email, and password are required.' }
  }

  const result = await beginAdminEmailVerification(email, displayName, password, 'initial')
  if (!result.success) return result
  return { success: true as const, challengeId: result.challengeId }
}

// Creates the first admin and signs them in; the service refuses once any admin exists.
export async function completeInitialAdminSignup(challengeId: string, code: string) {
  if (typeof challengeId !== 'string' || typeof code !== 'string') {
    return { success: false as const, error: 'A verification code is required.' }
  }

  try {
    return await verifyAdminEmail(challengeId, code, 'initial')
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { success: false as const, error: 'An account with that email already exists.' }
    }
    throw error
  }
}

export async function requestAdminPasswordReset(email: string) {
  if (typeof email !== 'string') {
    return { success: false as const, error: 'Enter a valid email address.' }
  }

  return beginSelfServiceAdminPasswordReset(email)
}

export async function resetAdminPassword(
  challengeId: string,
  code: string,
  newPassword: string,
) {
  if (
    typeof challengeId !== 'string' ||
    typeof code !== 'string' ||
    typeof newPassword !== 'string'
  ) {
    return { success: false as const, error: 'Invalid password reset request.' }
  }

  return completeSelfServiceAdminPasswordReset(
    challengeId,
    code,
    newPassword,
  )
}
