'use client'

import { useState } from 'react'
import {
  loginAdmin,
  requestAdminPasswordReset,
  resetAdminPassword,
} from '@/server/actions/admin/auth'

export default function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [challengeId, setChallengeId] = useState('')
  const [mode, setMode] = useState<'login' | 'request-reset' | 'verify-reset'>(
    'login',
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await loginAdmin(email, password)
      if (!result.success) {
        setError(result.error)
        return
      }

      window.location.assign('/admin')
    } catch (error) {
      console.error('Admin login failed:', error)
      setError('Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetRequest = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await requestAdminPasswordReset(email)
      if (!result.success) {
        setError(result.error)
        return
      }

      setChallengeId(result.challengeId)
      setMessage(result.message)
      setMode('verify-reset')
    } catch (error) {
      console.error('Admin password reset request failed:', error)
      setError('Unable to process the reset request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const result = await resetAdminPassword(
        challengeId,
        code,
        newPassword,
      )
      if (!result.success) {
        setError(result.error)
        return
      }

      setPassword('')
      setCode('')
      setNewPassword('')
      setConfirmPassword('')
      setMode('login')
      setMessage('Your password has been reset. You can now sign in.')
    } catch (error) {
      console.error('Admin password reset failed:', error)
      setError('Unable to reset the password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const returnToLogin = () => {
    setMode('login')
    setChallengeId('')
    setCode('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setMessage('')
  }

  const title =
    mode === 'request-reset'
      ? 'Reset Admin Password'
      : mode === 'verify-reset'
        ? 'Choose a New Password'
        : 'Admin Login'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800/50 p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          {title}
        </h1>
        {mode === 'verify-reset' && (
          <p className="mb-6 text-center text-sm text-gray-400">
            Enter the verification code sent to {email}, then choose a new
            password.
          </p>
        )}
        <form
          onSubmit={
            mode === 'login'
              ? handleSubmit
              : mode === 'request-reset'
                ? handleResetRequest
                : handleReset
          }
          className="space-y-4"
        >
          {mode !== 'verify-reset' && (
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete={mode === 'login' ? 'username' : 'email'}
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          )}
          {mode === 'login' && (
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          )}
          {mode === 'verify-reset' && (
            <>
              <div>
                <label
                  htmlFor="verification-code"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Verification code
                </label>
                <input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-center text-white tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={256}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">
                  Use at least 12 characters.
                </p>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Confirm new password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={256}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </>
          )}
          {message && (
            <p role="status" className="text-sm text-green-400">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-cyan-500 px-4 py-2 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
          >
            {loading
              ? mode === 'login'
                ? 'Signing in...'
                : mode === 'request-reset'
                  ? 'Sending code...'
                  : 'Resetting password...'
              : mode === 'login'
                ? 'Sign in'
                : mode === 'request-reset'
                  ? 'Send reset code'
                  : 'Reset password'}
          </button>
        </form>
        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => {
                setMode('request-reset')
                setError('')
                setMessage('')
              }}
              className="text-sm text-gray-400 underline hover:text-white"
            >
              Forgot password?
            </button>
          ) : (
            <button
              type="button"
              onClick={returnToLogin}
              className="text-sm text-gray-400 underline hover:text-white"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
