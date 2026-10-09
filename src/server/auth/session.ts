import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'node:crypto'
import { redirect } from 'next/navigation'
import { adminSessionsRepo } from '@/server/repos/admin-sessions'
import { adminUsersRepo } from '@/server/repos/admin-users'
import { verifyPassword } from './password'
import type { CurrentAdmin } from './types'
import { normalizeEmail } from './validation'

const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7

export function hashSessionId(sessionId: string) {
  return createHash('sha256').update(sessionId).digest('hex')
}

export async function createSession(userId: number) {
  const sessionId = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000)

  await adminSessionsRepo.insert({
    sessionId: hashSessionId(sessionId),
    userId,
    expiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  })
}

/** Hash of the session id in the request cookie, if any. */
export async function getCurrentSessionHash() {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value
  return sessionId ? hashSessionId(sessionId) : undefined
}

export async function getSessionAdmin(): Promise<CurrentAdmin | null> {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value
  if (!sessionId) return null

  const admin = await adminSessionsRepo.findActiveAdmin(hashSessionId(sessionId))
  return admin ?? null
}

export async function isAuthenticated() {
  return (await getSessionAdmin()) !== null
}

export async function requireAuth() {
  const admin = await getSessionAdmin()
  if (!admin) {
    redirect('/admin/login')
  }
  return admin
}

export async function login(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email)
  const user = await adminUsersRepo.findLoginByEmail(normalizedEmail)

  if (
    !user ||
    !user.isActive ||
    !(await verifyPassword(password, user.passwordHash))
  ) {
    return { success: false as const, error: 'Invalid email or password.' }
  }

  await createSession(user.id)
  return { success: true as const }
}

export async function logout() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value

  if (sessionId) {
    await adminSessionsRepo.deleteById(hashSessionId(sessionId))
  }

  cookieStore.delete(SESSION_COOKIE)
}
