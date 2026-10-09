'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { togglePortfolioSection, updatePageSection } from '@/actions/header'
import type { SectionMeta } from '@/lib/db/sections'

interface SectionSettingsFormProps {
  section: Pick<SectionMeta, 'kind' | 'navigationTitle' | 'title' | 'isEnabled'>
}

// Edits the page_sections row (title, navigation label, visibility) of the
// section that the surrounding admin page manages.
export default function SectionSettingsForm({ section }: SectionSettingsFormProps) {
  const [navigationTitle, setNavigationTitle] = useState(section.navigationTitle)
  const [title, setTitle] = useState(section.title ?? '')
  const [isEnabled, setIsEnabled] = useState(section.isEnabled)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await updatePageSection(section.kind, { navigationTitle, title })
      if (isEnabled !== section.isEnabled) {
        await togglePortfolioSection(section.kind, isEnabled)
      }
      setMessage('✅ Section settings saved!')
      router.refresh()
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : 'Failed to save section settings'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded ${message.startsWith('❌') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${section.kind}-navigation-title`} className="block text-sm font-medium text-gray-300 mb-1">
            Navigation label
          </label>
          <input
            id={`${section.kind}-navigation-title`}
            type="text"
            value={navigationTitle}
            onChange={(event) => setNavigationTitle(event.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label htmlFor={`${section.kind}-title`} className="block text-sm font-medium text-gray-300 mb-1">
            Section title
          </label>
          <input
            id={`${section.kind}-title`}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(event) => setIsEnabled(event.target.checked)}
        />
        Show this section on the portfolio
      </label>
      <button
        type="submit"
        disabled={loading}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save section settings'}
      </button>
    </form>
  )
}
