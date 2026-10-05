'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateGeneralSettings } from '@/actions/config'

interface GeneralSettingsFormProps {
  initialData: {
    apiBaseUrl: string | null
    smtpHost: string | null
    smtpPort: string | null
    smtpUsername: string | null
    hasSmtpPassword: boolean
    recaptchaSiteKey: string | null
  }
}

const inputClassName =
  'w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500'

export default function GeneralSettingsForm({
  initialData,
}: GeneralSettingsFormProps) {
  const [apiBaseUrl, setApiBaseUrl] = useState(initialData.apiBaseUrl ?? '')
  const [smtpHost, setSmtpHost] = useState(initialData.smtpHost ?? '')
  const [smtpPort, setSmtpPort] = useState(initialData.smtpPort ?? '')
  const [smtpUsername, setSmtpUsername] = useState(
    initialData.smtpUsername ?? '',
  )
  const [smtpPassword, setSmtpPassword] = useState('')
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(
    initialData.recaptchaSiteKey ?? '',
  )
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData()
    formData.set('apiBaseUrl', apiBaseUrl)
    formData.set('smtpHost', smtpHost)
    formData.set('smtpPort', smtpPort)
    formData.set('smtpUsername', smtpUsername)
    formData.set('smtpPassword', smtpPassword)
    formData.set('recaptchaSiteKey', recaptchaSiteKey)

    try {
      await updateGeneralSettings(formData)
      setSmtpPassword('')
      setMessage('General settings updated successfully!')
      router.refresh()
    } catch (error) {
      setMessage('Failed to update general settings')
      console.error('Error updating general settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {message && (
        <div
          role="status"
          className={`rounded p-3 ${
            message.startsWith('Failed')
              ? 'bg-red-500/20 text-red-400'
              : 'bg-green-500/20 text-green-400'
          }`}
        >
          {message}
        </div>
      )}

      <section className="space-y-4 rounded-lg bg-gray-800 p-6">
        <h2 className="text-lg font-semibold">API</h2>
        <div>
          <label
            htmlFor="apiBaseUrl"
            className="mb-1 block text-sm font-medium text-gray-300"
          >
            API Base URL
          </label>
          <input
            id="apiBaseUrl"
            type="url"
            value={apiBaseUrl}
            onChange={(event) => setApiBaseUrl(event.target.value)}
            className={inputClassName}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-lg bg-gray-800 p-6">
        <h2 className="text-lg font-semibold">SMTP</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="smtpHost"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Host
            </label>
            <input
              id="smtpHost"
              type="text"
              value={smtpHost}
              onChange={(event) => setSmtpHost(event.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label
              htmlFor="smtpPort"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Port
            </label>
            <input
              id="smtpPort"
              type="text"
              value={smtpPort}
              onChange={(event) => setSmtpPort(event.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label
              htmlFor="smtpUsername"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="smtpUsername"
              type="text"
              value={smtpUsername}
              onChange={(event) => setSmtpUsername(event.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label
              htmlFor="smtpPassword"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="smtpPassword"
              type="password"
              autoComplete="new-password"
              value={smtpPassword}
              onChange={(event) => setSmtpPassword(event.target.value)}
              placeholder={
                initialData.hasSmtpPassword
                  ? 'Saved — leave blank to keep current password'
                  : 'SMTP password'
              }
              className={inputClassName}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg bg-gray-800 p-6">
        <h2 className="text-lg font-semibold">reCAPTCHA</h2>
        <div>
          <label
            htmlFor="recaptchaSiteKey"
            className="mb-1 block text-sm font-medium text-gray-300"
          >
            Site Key
          </label>
          <input
            id="recaptchaSiteKey"
            type="text"
            value={recaptchaSiteKey}
            onChange={(event) => setRecaptchaSiteKey(event.target.value)}
            className={inputClassName}
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-cyan-500 px-6 py-2 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save General Settings'}
      </button>
    </form>
  )
}
