'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  createContactMethod,
  updateContactMethod,
  deleteContactMethod,
  reorderContactMethods,
} from '@/actions/contact'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import {
  CONTACT_METHOD_SECTION_KINDS,
  type ContactMethodKind,
  type ContactMethodSectionKind,
} from '@/lib/db/constants'

interface ContactMethod {
  id: number
  kind: ContactMethodKind
  title: string
  value: string
  sortOrder: number | null
  sections: ContactMethodSectionKind[]
}

interface ContactMethodsFormProps {
  contactMethods: ContactMethod[]
}

const methodKinds: Array<{ value: ContactMethodKind; label: string }> = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'address', label: 'Address' },
  { value: 'other', label: 'Other' },
]

const sectionLabels: Record<ContactMethodSectionKind, string> = {
  about: 'About',
  contact: 'Contact',
}

export default function ContactMethodsForm({ contactMethods }: ContactMethodsFormProps) {
  const [items, setItems] = useState(contactMethods)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editKind, setEditKind] = useState<ContactMethodKind>('other')
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editSections, setEditSections] = useState<ContactMethodSectionKind[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const setKindFromInput = (value: string) => {
    const kind = methodKinds.find((option) => option.value === value)
    if (kind) setEditKind(kind.value)
  }
  const toggleEditSection = (section: ContactMethodSectionKind) => {
    setEditSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section],
    )
  }

  const handleCreate = async (formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      const method = await createContactMethod(formData)
      setItems((current) => [...current, method])
      setMessage('✅ Contact information added successfully!')
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to add contact information')
      console.error('Error creating contact info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: number) => {
    setLoading(true)
    setMessage('')
    const formData = new FormData()
    formData.set('title', editTitle)
    formData.set('value', editContent)
    formData.set('kind', editKind)
    editSections.forEach((section) => formData.append('sections', section))
    
    try {
      const method = await updateContactMethod(id, formData)
      setItems((current) => current.map((item) => item.id === id ? method : item))
      setMessage('✅ Contact information updated successfully!')
      setEditingId(null)
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to update contact information')
      console.error('Error updating contact info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this contact info?')) return
    
    setLoading(true)
    setMessage('')
    try {
      await deleteContactMethod(id)
      setItems((current) => current.filter((item) => item.id !== id))
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to delete contact method')
      console.error('Error deleting contact info:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const itemsCopy = Array.from(items)
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1)
    itemsCopy.splice(result.destination.index, 0, reorderedItem)

    const ids = itemsCopy.map(item => item.id)
    setItems(itemsCopy)
    try {
      await reorderContactMethods(ids)
      router.refresh()
    } catch (error) {
      setItems(items)
      setMessage('❌ Failed to reorder contact methods')
      console.error('Error reordering contact methods:', error)
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}
      {/* Create New */}
      <form action={handleCreate} className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
          <select
            name="kind"
            defaultValue="other"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          >
            {methodKinds.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">Label</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Email"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">Value</label>
          <input
            type="text"
            name="value"
            placeholder="e.g., name@example.com"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <fieldset className="flex gap-3 pb-2">
          <legend className="sr-only">Shown in</legend>
          {CONTACT_METHOD_SECTION_KINDS.map((section) => (
            <label key={section} className="flex items-center gap-1 text-sm text-gray-300">
              <input type="checkbox" name="sections" value={section} defaultChecked />
              {sectionLabels[section]}
            </label>
          ))}
        </fieldset>
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition whitespace-nowrap disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {/* List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="contactInfo">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={String(item.id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-3 p-3 bg-gray-800 rounded-lg ${
                        snapshot.isDragging ? 'shadow-lg ring-2 ring-cyan-500' : ''
                      }`}
                    >
                      <span
                        {...provided.dragHandleProps}
                        className="text-gray-400 cursor-grab"
                      >
                        ⠿
                      </span>

                      {editingId === item.id ? (
                        <>
                          <select
                            value={editKind}
                            onChange={(event) => setKindFromInput(event.target.value)}
                            className="px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white"
                          >
                            {methodKinds.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}
                          </select>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white focus:outline-none"
                            placeholder="Title"
                          />
                          <input
                            type="text"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="flex-1 px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white focus:outline-none"
                            placeholder="Content"
                          />
                          <div className="flex gap-2">
                            {CONTACT_METHOD_SECTION_KINDS.map((section) => (
                              <label key={section} className="flex items-center gap-1 text-xs text-gray-300">
                                <input
                                  type="checkbox"
                                  checked={editSections.includes(section)}
                                  onChange={() => toggleEditSection(section)}
                                />
                                {sectionLabels[section]}
                              </label>
                            ))}
                          </div>
                          <button
                            onClick={() => handleUpdate(item.id)}
                            disabled={loading}
                            className="text-green-400 hover:text-green-300 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 hover:text-gray-300 transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold w-24 text-cyan-400">
                            {item.title}
                          </span>
                          <span className="flex-1 text-gray-300">
                            {item.value}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.sections.length > 0
                              ? item.sections.map((section) => sectionLabels[section]).join(' · ')
                              : 'Hidden'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingId(item.id)
                              setEditKind(item.kind)
                              setEditTitle(item.title)
                              setEditContent(item.value)
                              setEditSections(item.sections)
                            }}
                            className="text-cyan-400 hover:text-cyan-300 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={loading}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            Delete
                          </button>
                        </>
                      )}
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
  )
}