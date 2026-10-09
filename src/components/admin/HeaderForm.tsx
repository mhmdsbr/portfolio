'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  reorderHeaderSections,
  togglePortfolioSection,
} from '@/actions/header'
import type { SectionKind } from '@/lib/db/constants'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'

interface PageSection {
  kind: SectionKind
  navigationTitle: string
  title: string | null
  sortOrder: number
  isEnabled: boolean
}

interface HeaderFormProps {
  initialSections: PageSection[]
}

const sectionIcons: Record<SectionKind, string> = {
  hero: '🏠',
  about: '👤',
  experience: '💼',
  services: '⚡',
  projects: '📁',
  testimonials: '💬',
  contact: '✉️',
}

export default function HeaderForm({ initialSections }: HeaderFormProps) {
  const [sections, setSections] = useState(initialSections)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleToggle = async (section: PageSection) => {
    setLoading(true)
    setMessage('')
    try {
      await togglePortfolioSection(section.kind, !section.isEnabled)
      setSections((previous) => previous.map((item) =>
        item.kind === section.kind ? { ...item, isEnabled: !item.isEnabled } : item,
      ))
      setMessage('Portfolio layout updated.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update portfolio layout')
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
      await reorderHeaderSections(reordered.map(({ kind }) => kind))
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

      <section>
        <h2 className="text-lg font-semibold mb-1">Portfolio Page Layout</h2>
        <p className="text-sm text-gray-400 mb-4">
          Reorder sections or hide one. Titles, navigation labels and content are
          edited on each section page.
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
                    key={section.kind}
                    draggableId={section.kind}
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
                          {sectionIcons[section.kind] || '📄'}
                        </span>
                        <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm text-white">{section.navigationTitle}</p>
                            <p className="truncate text-xs text-gray-400">
                              <span className="font-mono">{section.kind}</span>
                              {section.title ? ` · ${section.title}` : ''}
                              {' · '}#{index + 1}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Link
                              href={`/admin/${section.kind}`}
                              className="text-sm text-cyan-400 transition hover:text-cyan-300"
                            >
                              Edit
                            </Link>
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
