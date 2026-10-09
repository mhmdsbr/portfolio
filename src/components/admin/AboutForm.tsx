'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateAbout } from '@/actions/about'
import type { ButtonConfig } from '@/lib/db/section-config'

interface AboutFormProps {
  profile: {
    name: string | null
    jobTitle: string | null
    biography: string | null
  }
  config: ButtonConfig
}

export default function AboutForm({ profile, config }: AboutFormProps) {
  const [name, setName] = useState(profile.name || '')
  const [jobTitle, setJobTitle] = useState(profile.jobTitle || '')
  const [description, setDescription] = useState(profile.biography || '')
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
    formData.set('name', name)
    formData.set('jobTitle', jobTitle)
    formData.set('description', description)
    formData.set('buttonText', buttonText)
    formData.set('buttonUrl', buttonUrl)

    try {
      await updateAbout(formData)
      setMessage('✅ About section updated successfully!')
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to update about section')
      console.error('Error updating about:', error)
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Full Stack Developer"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="I am a passionate developer with 5+ years of experience..."
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder="Download CV"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Button URL
          </label>
          <input
            type="text"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            placeholder="/cv.pdf"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save About Section'}
      </button>
    </form>
  )
}