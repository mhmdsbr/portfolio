'use server'

import { login, logout } from '@/server/auth/session'
import {
  completeSelfServiceAdminPasswordReset,
  beginSelfServiceAdminPasswordReset,
} from '@/server/services/admin-verification'

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
