'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateGeneralSettings } from '@/actions/config'

interface GeneralSettingsFormProps {
  initialData: {
    recaptchaSiteKey: string | null
  }
}

const inputClassName =
  'w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500'

export default function GeneralSettingsForm({
  initialData,
}: GeneralSettingsFormProps) {
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
    formData.set('recaptchaSiteKey', recaptchaSiteKey)

    try {
      const result = await updateGeneralSettings(formData)
      if (!result.success) { setMessage(`❌ ${result.error}`); return }
      setMessage('General settings updated successfully!')
      router.refresh()
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : 'Failed to update general settings'}`)
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
            !message.startsWith('✅')
              ? 'bg-red-500/20 text-red-400'
              : 'bg-green-500/20 text-green-400'
          }`}
        >
          {message}
        </div>
      )}

      <section className="space-y-2 rounded-lg bg-gray-800 p-6">
        <h2 className="text-lg font-semibold">Email delivery</h2>
        <p className="text-sm text-gray-300">
          SMTP is configured with server-only environment variables:
          {' '}SMTP_HOST, SMTP_PORT, SMTP_USERNAME, and SMTP_PASSWORD.
        </p>
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
