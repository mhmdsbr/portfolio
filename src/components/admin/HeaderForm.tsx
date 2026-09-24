'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addHeaderSection, reorderHeaderSections, updateHeaderSection, updateHeaderSettings } from '@/actions/header'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'

interface HeaderSection {
  id: number
  sectionId: string
  title: string
  sortOrder: number
}

interface HeaderFormProps {
  initialSettings: {
    defaultTitle: string
  }
  initialSections: HeaderSection[]
}

export default function HeaderForm({ initialSettings, initialSections }: HeaderFormProps) {
  const [sections, setSections] = useState(initialSections)
  const [defaultTitle, setDefaultTitle] = useState(initialSettings.defaultTitle)
  const [newSectionId, setNewSectionId] = useState('')
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [addError, setAddError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const router = useRouter()

  const handleTitleChange = async (id: number, newTitle: string) => {
    setLoading(true)
    try {
      await updateHeaderSection(id, newTitle)
      setSections(prev => 
        prev.map(s => s.id === id ? { ...s, title: newTitle } : s)
      )
      setMessage('✅ Header section updated successfully!')
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to update header section')
      console.error('Error updating section:', error)
    } finally {
      setLoading(false)
      setEditingId(null)
    }
  }

  const handleDefaultTitleChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData()
    formData.set('defaultTitle', defaultTitle)

    try {
      await updateHeaderSettings(formData)
      setMessage('✅ Header settings updated successfully!')
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to update header settings')
      console.error('Error updating default title:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setAddError('')

    try {
      const section = await addHeaderSection(newSectionId, newSectionTitle)
      setSections(prev => [...prev, { ...section, sortOrder: section.sortOrder ?? 0 }])
      setNewSectionId('')
      setNewSectionTitle('')
      setMessage('✅ Header section added successfully!')
      router.refresh()
    } catch (error) {
      setAddError(error instanceof Error ? error.message : 'Unable to add header title')
      setMessage('❌ Failed to add header section')
    } finally {
      setLoading(false)
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSections(items)

    // Update sort orders
    const ids = items.map(item => item.id)
    await reorderHeaderSections(ids)
    router.refresh()
  }

  const sectionIdMap: Record<string, string> = {
    hero: '🏠',
    about: '👤',
    experience: '💼',
    services: '⚡',
    projects: '📁',
    contact: '✉️',
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-3 rounded ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}
      {/* Header Title */}
      <form onSubmit={handleDefaultTitleChange} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Header Title
          </label>
          <input
            type="text"
            value={defaultTitle}
            onChange={(e) => setDefaultTitle(e.target.value)}
            placeholder="Welcome"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            This title is shown in the header before the active section text starts scrolling.
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

      {/* Add Section Title */}
      <form onSubmit={handleAddSection} className="space-y-4 max-w-2xl">
        <div>
          <h3 className="text-lg font-semibold mb-1">Add Header Title</h3>
          <p className="text-sm text-gray-400">
            Add a title for a new section. The section ID must be unique and match the page section anchor.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={newSectionId}
            onChange={(e) => setNewSectionId(e.target.value)}
            placeholder="Section ID (e.g. testimonials)"
            required
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="Header title"
            required
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        {addError && <p className="text-sm text-red-400">{addError}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Header Title'}
        </button>
      </form>

      {/* Sections List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Section Titles</h3>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder sections. Click on a title to edit.
        </p>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
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
                        {...provided.dragHandleProps}
                        className={`flex items-center gap-4 p-3 bg-gray-800 rounded-lg ${
                          snapshot.isDragging ? 'shadow-lg ring-2 ring-cyan-500' : ''
                        }`}
                      >
                        <span className="text-gray-400 cursor-grab">⠿</span>
                        <span className="text-xl">{sectionIdMap[section.sectionId] || '📄'}</span>
                        <span className="text-sm text-gray-400 font-mono w-24">
                          {section.sectionId}
                        </span>
                        
                        {editingId === section.id ? (
                          <input
                            type="text"
                            defaultValue={section.title}
                            onBlur={(e) => handleTitleChange(section.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleTitleChange(section.id, (e.target as HTMLInputElement).value)
                              }
                              if (e.key === 'Escape') {
                                setEditingId(null)
                              }
                            }}
                            autoFocus
                            className="flex-1 px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white focus:outline-none"
                          />
                        ) : (
                          <span 
                            className="flex-1 cursor-pointer hover:text-cyan-400 transition"
                            onClick={() => setEditingId(section.id)}
                          >
                            {section.title}
                          </span>
                        )}
                        
                        <span className="text-xs text-gray-500">
                          #{index + 1}
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}