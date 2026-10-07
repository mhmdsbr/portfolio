'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  reorderHeaderSections,
  togglePortfolioSection,
  updatePageSection,
  updateHeaderSettings,
} from '@/actions/header'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'

interface PageSection {
  id: number
  sectionKey: string
  navigationTitle: string
  title: string | null
  overlayTitle: string | null
  sortOrder: number
  isEnabled: boolean
}

interface HeaderFormProps {
  initialSettings: {
    defaultTitle: string
  }
  initialSections: PageSection[]
}

const sectionIcons: Record<string, string> = {
  hero: '🏠',
  about: '👤',
  experience: '💼',
  services: '⚡',
  projects: '📁',
  testimonials: '💬',
  contact: '✉️',
}

export default function HeaderForm({ initialSettings, initialSections }: HeaderFormProps) {
  const [sections, setSections] = useState(initialSections)
  const [defaultTitle, setDefaultTitle] = useState(initialSettings.defaultTitle)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSectionSave = async (section: PageSection) => {
    setLoading(true)
    setMessage('')
    try {
      const savedSection = await updatePageSection(section.id, {
        navigationTitle: section.navigationTitle,
        title: section.title ?? '',
        overlayTitle: section.overlayTitle ?? '',
      })
      setSections((previous) => previous.map((item) =>
        item.id === section.id
          ? {
              ...item,
              navigationTitle: savedSection.navigationTitle,
              title: savedSection.title,
              overlayTitle: savedSection.overlayTitle,
            }
          : item,
      ))
      setMessage('Section presentation saved.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save section presentation')
    } finally {
      setLoading(false)
    }
  }

  const updateSectionDraft = (id: number, field: 'navigationTitle' | 'title' | 'overlayTitle', value: string) => {
    setSections((previous) => previous.map((section) =>
      section.id === id ? { ...section, [field]: value } : section,
    ))
  }

  const handleToggle = async (section: PageSection) => {
    setLoading(true)
    setMessage('')
    try {
      await togglePortfolioSection(section.id, !section.isEnabled)
      setSections((previous) => previous.map((item) =>
        item.id === section.id ? { ...item, isEnabled: !item.isEnabled } : item,
      ))
      setMessage('Portfolio layout updated.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update portfolio layout')
    } finally {
      setLoading(false)
    }
  }

  const handleDefaultTitleChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData()
    formData.set('defaultTitle', defaultTitle)

    try {
      await updateHeaderSettings(formData)
      setMessage('Header title saved.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save header title')
    } finally {
      setLoading(false)
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const previousSections = sections
    const reordered = Array.from(sections)
    const [movedSection] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, movedSection)
    setSections(reordered)

    try {
      await reorderHeaderSections(reordered.map(({ id }) => id))
      router.refresh()
    } catch (error) {
      setSections(previousSections)
      setMessage(error instanceof Error ? error.message : 'Failed to reorder sections')
    }
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-3 rounded ${message.startsWith('Failed') || message.startsWith('Invalid') || message.startsWith('At least')
          ? 'bg-red-500/20 text-red-400'
          : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleDefaultTitleChange} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Header Title
          </label>
          <input
            type="text"
            value={defaultTitle}
            onChange={(event) => setDefaultTitle(event.target.value)}
            placeholder="Welcome"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Shown in the header before the active section title.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Header Title'}
        </button>
      </form>

      <section>
        <h2 className="text-lg font-semibold mb-1">Portfolio Page Layout</h2>
        <p className="text-sm text-gray-400 mb-4">
          Set shared section titles, reorder sections, or hide a section. Section-specific
          content and portfolio records are managed on their own pages.
        </p>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="portfolio-sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 max-w-2xl"
              >
                {sections.map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={String(section.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-4 p-3 bg-gray-800 rounded-lg ${
                          snapshot.isDragging ? 'shadow-lg ring-2 ring-cyan-500' : ''
                        }`}
                      >
                        <span {...provided.dragHandleProps} className="self-start pt-2 text-gray-400 cursor-grab" aria-label={`Reorder ${section.navigationTitle}`}>
                          ⠿
                        </span>
                        <span className="self-start pt-2 text-xl" aria-hidden="true">
                          {sectionIcons[section.sectionKey] || '📄'}
                        </span>
                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-gray-400 font-mono">{section.sectionKey}</span>
                            <span className="text-xs text-gray-500">#{index + 1}</span>
                          </div>
                          <div className="grid gap-3 md:grid-cols-3">
                            {([
                              ['navigationTitle', 'Navigation label'],
                              ['title', 'Section title'],
                              ['overlayTitle', 'Overlay title'],
                            ] as const).map(([field, label]) => (
                              <label key={field} className="block text-xs text-gray-400">
                                {label}
                                <input
                                  type="text"
                                  value={section[field] ?? ''}
                                  onChange={(event) => updateSectionDraft(section.id, field, event.target.value)}
                                  disabled={loading}
                                  className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                              </label>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => void handleSectionSave(section)}
                              disabled={loading}
                              className="rounded-md bg-gray-700 px-3 py-1.5 text-sm text-cyan-400 transition hover:bg-gray-600 disabled:opacity-50"
                            >
                              Save section data
                            </button>
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                              <input
                                type="checkbox"
                                checked={section.isEnabled}
                                disabled={loading}
                                onChange={() => void handleToggle(section)}
                                aria-label={`${section.isEnabled ? 'Hide' : 'Show'} ${section.navigationTitle}`}
                              />
                              Visible
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </div>
  )
}
