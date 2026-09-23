'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateHero, updateHeroTitles } from '@/actions/hero'
import Image from 'next/image'

interface HeroFormProps {
  initialData: {
    id: number
    location: string | null
    subtitleOne: string | null
    subtitleTwo: string | null
    logoUrl: string | null
    titles: string[]
  }
}

export default function HeroForm({ initialData }: HeroFormProps) {
  const [location, setLocation] = useState(initialData.location || '')
  const [subtitleOne, setSubtitleOne] = useState(initialData.subtitleOne || '')
  const [subtitleTwo, setSubtitleTwo] = useState(initialData.subtitleTwo || '')
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || '')
  const [titles, setTitles] = useState(initialData.titles.join(', '))
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData()
    formData.set('location', location)
    formData.set('subtitleOne', subtitleOne)
    formData.set('subtitleTwo', subtitleTwo)
    formData.set('logoUrl', logoUrl)

    try {
      // Update hero section
      await updateHero(formData)

      // Update hero titles
      const titlesArray = titles.split(',').map(t => t.trim()).filter(Boolean)
      await updateHeroTitles(titlesArray)

      setMessage('✅ Hero section updated successfully!')
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to update hero section')
      console.error('Error updating hero:', error)
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

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Hero Titles (comma separated)
        </label>
        <input
          type="text"
          value={titles}
          onChange={(e) => setTitles(e.target.value)}
          placeholder="Creative, Developer, Designer"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Enter hero titles separated by commas (e.g., Creative, Developer, Designer)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="San Francisco, CA"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Subtitle One
          </label>
          <input
            type="text"
            value={subtitleOne}
            onChange={(e) => setSubtitleOne(e.target.value)}
            placeholder="Software Engineer"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Subtitle Two
          </label>
          <input
            type="text"
            value={subtitleTwo}
            onChange={(e) => setSubtitleTwo(e.target.value)}
            placeholder="Full Stack Developer"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Logo URL
        </label>
        <input
          type="text"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://example.com/logo.png"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {logoUrl && (
          <div className="mt-2 p-2 bg-gray-800 rounded inline-block">
            <Image src={logoUrl} alt="Logo preview" width="12" height="12" className="h-12 w-auto" />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Hero Section'}
      </button>
    </form>
  )
}