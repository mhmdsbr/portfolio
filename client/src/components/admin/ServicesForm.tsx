'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateServices } from '@/actions/services'

interface ServicesFormProps {
  initialData: {
    id: number
    title: string | null
    overlayTitle: string | null
  }
}

export default function ServicesForm({ initialData }: ServicesFormProps) {
  const [title, setTitle] = useState(initialData.title || '')
  const [overlayTitle, setOverlayTitle] = useState(initialData.overlayTitle || '')
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

    try {
      await updateServices(formData)
      setMessage('✅ Services section updated successfully!')
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to update services section')
      console.error('Error updating services:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Services"
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
            placeholder="What I Do"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Services Section'}
      </button>
    </form>
  )
}