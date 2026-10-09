import { login, logout } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('email' in body) ||
    typeof body.email !== 'string' ||
    !('password' in body) ||
    typeof body.password !== 'string'
  ) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const result = await login(body.email, body.password)

  if (result.success) {
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json(
    { error: result.error },
    { status: 401 }
  )
}

export async function DELETE() {
  await logout()
  return NextResponse.json({ success: true })
}