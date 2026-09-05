import { cookies } from 'next/headers'

// Simple auth - in production, use a proper auth solution
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123'

export async function login(username: string, password: string) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    // Simple session token - in production, use JWT
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return { success: true }
  }
  return { success: false, error: 'Invalid credentials' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

export async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

// For server components
export async function requireAuth() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    throw new Error('Unauthorized')
  }
  return true
}