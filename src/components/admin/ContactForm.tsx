'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateContact } from '@/actions/contact'
import type { ContactConfig } from '@/lib/db/section-config'

interface ContactFormProps {
  config: ContactConfig
}

export default function ContactForm({ config }: ContactFormProps) {
  const [formTitle, setFormTitle] = useState(config.formTitle || '')
  const [buttonText, setButtonText] = useState(config.buttonText || '')
  const [buttonUrl, setButtonUrl] = useState(config.buttonUrl || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData()
    formData.set('formTitle', formTitle)
    formData.set('buttonText', buttonText)
    formData.set('buttonUrl', buttonUrl)

    try {
      const result = await updateContact(formData)
      if (!result.success) { setMessage(`❌ ${result.error}`); return }
      setMessage('✅ Contact section updated successfully!')
      router.refresh()
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : 'Failed to update contact section'}`)
      console.error('Error updating contact:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {message && (
        <div className={`p-3 rounded ${!message.startsWith('✅') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      {/* Form Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Form Title
          </label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Send me a message"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Submit Button Text
          </label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder="Send Message"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Button URL
        </label>
        <input
          type="text"
          value={buttonUrl}
          onChange={(e) => setButtonUrl(e.target.value)}
          placeholder="#contact"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Contact Section'}
      </button>
    </form>
  )
}