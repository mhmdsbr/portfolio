import { login, logout } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { username, password } = await request.json()
  
  const result = await login(username, password)
  
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