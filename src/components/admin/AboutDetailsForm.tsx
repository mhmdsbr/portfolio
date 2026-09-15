'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDetail, updateDetail, deleteDetail, reorderDetails } from '@/actions/about'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface Detail {
  id: number
  number: number
  title: string
  sortOrder: number | null
}

interface AboutDetailsFormProps {
  details: Detail[]
}

export default function AboutDetailsForm({ details }: AboutDetailsFormProps) {
  const [items, setItems] = useState(details)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editNumber, setEditNumber] = useState(0)
  const [editTitle, setEditTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async (formData: FormData) => {
    setLoading(true)
    try {
      await createDetail(formData)
      router.refresh()
    } catch (error) {
      console.error('Error creating detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: number) => {
    setLoading(true)
    const formData = new FormData()
    formData.set('number', String(editNumber))
    formData.set('title', editTitle)
    
    try {
      await updateDetail(id, formData)
      setEditingId(null)
      router.refresh()
    } catch (error) {
      console.error('Error updating detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this detail?')) return
    
    setLoading(true)
    try {
      await deleteDetail(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting detail:', error)
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
    await reorderDetails(ids)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Create New */}
      <form action={handleCreate} className="flex gap-2 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Number
          </label>
          <input
            type="number"
            name="number"
            placeholder="5"
            className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Years Experience"
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
        <Droppable droppableId="details">
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
                            type="number"
                            value={editNumber}
                            onChange={(e) => setEditNumber(parseInt(e.target.value))}
                            className="w-24 px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white focus:outline-none"
                          />
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white focus:outline-none"
                            placeholder="Title"
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
                          <span className="text-2xl font-bold text-cyan-400 w-16">
                            {item.number}
                          </span>
                          <span className="flex-1 text-gray-300">
                            {item.title}
                          </span>
                          <button
                            onClick={() => {
                              setEditingId(item.id)
                              setEditNumber(item.number)
                              setEditTitle(item.title)
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