'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateContact } from '@/actions/contact'

interface ContactFormProps {
  initialData: {
    id: number
    title: string | null
    overlayTitle: string | null
    formTitle: string | null
    buttonText: string | null
    buttonUrl: string | null
    infoTitle: string | null
    address: string | null
    phone: string | null
    email: string | null
  }
}

export default function ContactForm({ initialData }: ContactFormProps) {
  const [title, setTitle] = useState(initialData.title || '')
  const [overlayTitle, setOverlayTitle] = useState(initialData.overlayTitle || '')
  const [formTitle, setFormTitle] = useState(initialData.formTitle || '')
  const [buttonText, setButtonText] = useState(initialData.buttonText || '')
  const [buttonUrl, setButtonUrl] = useState(initialData.buttonUrl || '')
  const [infoTitle, setInfoTitle] = useState(initialData.infoTitle || '')
  const [address, setAddress] = useState(initialData.address || '')
  const [phone, setPhone] = useState(initialData.phone || '')
  const [email, setEmail] = useState(initialData.email || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData()
    formData.set('title', title)
    formData.set('overlayTitle', overlayTitle)
    formData.set('formTitle', formTitle)
    formData.set('buttonText', buttonText)
    formData.set('buttonUrl', buttonUrl)
    formData.set('infoTitle', infoTitle)
    formData.set('address', address)
    formData.set('phone', phone)
    formData.set('email', email)

    try {
      await updateContact(formData)
      setMessage('✅ Contact section updated successfully!')
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to update contact section')
      console.error('Error updating contact:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {message && (
        <div className={`p-3 rounded ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      {/* Section Titles */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Primary Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contact"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Overlay Title
          </label>
          <input
            type="text"
            value={overlayTitle}
            onChange={(e) => setOverlayTitle(e.target.value)}
            placeholder="Get in touch"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

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

      {/* Contact Info */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Info Title
        </label>
        <input
          type="text"
          value={infoTitle}
          onChange={(e) => setInfoTitle(e.target.value)}
          placeholder="Contact Information"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info@example.com"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 234 567 890"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main Street, City, Country"
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