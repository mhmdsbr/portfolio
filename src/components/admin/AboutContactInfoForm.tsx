'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createContactInfo, updateContactInfo, deleteContactInfo, reorderContactInfo } from '@/actions/about'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface ContactInfo {
  id: number
  title: string
  content: string
  sortOrder: number | null
}

interface AboutContactInfoFormProps {
  contactInfo: ContactInfo[]
}

export default function AboutContactInfoForm({ contactInfo }: AboutContactInfoFormProps) {
  const [items, setItems] = useState(contactInfo)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleCreate = async (formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      await createContactInfo(formData)
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
    formData.set('content', editContent)
    
    try {
      await updateContactInfo(id, formData)
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
    try {
      await deleteContactInfo(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting contact info:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const itemsCopy = Array.from(items)
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1)
    itemsCopy.splice(result.destination.index, 0, reorderedItem)

    setItems(itemsCopy)

    const ids = itemsCopy.map(item => item.id)
    await reorderContactInfo(ids)
    router.refresh()
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
          <label className="block text-sm font-medium text-gray-300 mb-1">
            New Contact Info
          </label>
          <input
            type="text"
            name="title"
            placeholder="Title (e.g., Email)"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            name="content"
            placeholder="Content (e.g., john@example.com)"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
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
                            {item.content}
                          </span>
                          <button
                            onClick={() => {
                              setEditingId(item.id)
                              setEditTitle(item.title)
                              setEditContent(item.content)
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