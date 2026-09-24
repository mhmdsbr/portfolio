'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createExperience, updateExperience, deleteExperience, reorderExperiences } from '@/actions/summary'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface Experience {
  id: number
  skill: string
  level: number | null
  sortOrder: number | null
}

interface ExperiencesFormProps {
  experiences: Experience[]
}

export default function ExperiencesForm({ experiences }: ExperiencesFormProps) {
  const [items, setItems] = useState(experiences)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

  const handleCreate = async (formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      await createExperience(formData)
      setMessage('✅ Skill added successfully!')
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to add skill')
      console.error('Error creating experience:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: number, formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      await updateExperience(id, formData)
      setMessage('✅ Skill updated successfully!')
      setEditingId(null)
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to update skill')
      console.error('Error updating experience:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this skill?')) return
    
    setDeletingId(id)
    try {
      await deleteExperience(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting experience:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const itemsCopy = Array.from(items)
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1)
    itemsCopy.splice(result.destination.index, 0, reorderedItem)

    setItems(itemsCopy)

    const ids = itemsCopy.map(item => item.id)
    await reorderExperiences(ids)
    router.refresh()
  }

  // Handle edit form submission
  const handleEditSubmit = (id: number, formData: FormData) => {
    handleUpdate(id, formData)
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}
      {/* Create New Experience */}
      <form action={handleCreate} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">Skill</label>
          <input
            type="text"
            name="skill"
            placeholder="JavaScript"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-300 mb-1">Level (1-100)</label>
          <input
            type="number"
            name="level"
            placeholder="90"
            min="1"
            max="100"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition whitespace-nowrap disabled:opacity-50"
        >
          Add Skill
        </button>
      </form>

      {/* Experience List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="experiences">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-3 p-3 bg-gray-800 rounded-lg ${
                        snapshot.isDragging ? 'shadow-lg ring-2 ring-cyan-500' : ''
                      }`}
                    >
                      <span {...provided.dragHandleProps} className="text-gray-400 cursor-grab">
                        ⠿
                      </span>

                      {editingId === item.id ? (
                        <form
                          action={(formData) => handleEditSubmit(item.id, formData)}
                          className="flex-1 flex items-center gap-3"
                        >
                          <input
                            type="text"
                            name="skill"
                            defaultValue={item.skill}
                            placeholder="Skill"
                            className="flex-1 px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white focus:outline-none"
                            required
                          />
                          <input
                            type="number"
                            name="level"
                            defaultValue={item.level || ''}
                            placeholder="Level"
                            min="1"
                            max="100"
                            className="w-24 px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white focus:outline-none"
                            required
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="text-green-400 hover:text-green-300 transition"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 hover:text-gray-300 transition"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>
                          <span className="flex-1 text-white">{item.skill}</span>
                          <div className="flex items-center gap-3 w-48">
                            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all"
                                style={{ width: `${item.level || 0}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-400 w-8">{item.level || 0}%</span>
                          </div>
                          <button
                            onClick={() => setEditingId(item.id)}
                            className="text-cyan-400 hover:text-cyan-300 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="text-red-400 hover:text-red-300 transition disabled:opacity-50"
                          >
                            {deletingId === item.id ? 'Deleting...' : 'Delete'}
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