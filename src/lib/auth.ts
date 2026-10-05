import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { redirect } from 'next/navigation'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7
const JWT_ISSUER = 'mhmd-portfolio'

interface AdminTokenPayload {
  sub: 'admin'
  iss: typeof JWT_ISSUER
  iat: number
  exp: number
}

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET

  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('ADMIN_JWT_SECRET must be configured with at least 32 bytes')
  }

  return secret
}

function signToken(payload: AdminTokenPayload) {
  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
  ).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signingInput = `${header}.${body}`
  const signature = createHmac('sha256', getJwtSecret())
    .update(signingInput)
    .digest('base64url')

  return `${signingInput}.${signature}`
}

function verifyToken(token: string): AdminTokenPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const expectedSignature = createHmac('sha256', getJwtSecret())
    .update(signingInput)
    .digest()
  const providedSignature = Buffer.from(encodedSignature, 'base64url')

  if (
    expectedSignature.length !== providedSignature.length ||
    !timingSafeEqual(expectedSignature, providedSignature)
  ) {
    return null
  }

  try {
    const header: unknown = JSON.parse(
      Buffer.from(encodedHeader, 'base64url').toString('utf8'),
    )
    const payload: unknown = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    )

    if (
      typeof header !== 'object' ||
      header === null ||
      !('alg' in header) ||
      header.alg !== 'HS256' ||
      typeof payload !== 'object' ||
      payload === null ||
      !('sub' in payload) ||
      payload.sub !== 'admin' ||
      !('iss' in payload) ||
      payload.iss !== JWT_ISSUER ||
      !('iat' in payload) ||
      typeof payload.iat !== 'number' ||
      !('exp' in payload) ||
      typeof payload.exp !== 'number' ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null
    }

    return payload as AdminTokenPayload
  } catch {
    return null
  }
}

export async function login(username: string, password: string) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    const now = Math.floor(Date.now() / 1000)
    const token = signToken({
      sub: 'admin',
      iss: JWT_ISSUER,
      iat: now,
      exp: now + SESSION_DURATION_SECONDS,
    })

    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_SECONDS,
    })
    return { success: true }
  }
  return { success: false, error: 'Invalid credentials' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return token ? verifyToken(token) !== null : false
}

// For server components
export async function requireAuth() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }
  return true
}