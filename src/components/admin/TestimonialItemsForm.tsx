'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createTestimonialItem, updateTestimonialItem, deleteTestimonialItem, reorderTestimonialItems } from '@/actions/testimonials'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Image from 'next/image'

interface TestimonialItem {
  id: number
  imageUrl: string | null
  title: string
  subtitle: string | null
  rating: string | null
  content: string | null
  sortOrder: number | null
}

interface TestimonialItemsFormProps {
  items: TestimonialItem[]
}

const ratingOptions = [
  { value: '1 Star', label: '⭐ 1 Star' },
  { value: '2 Stars', label: '⭐⭐ 2 Stars' },
  { value: '3 Stars', label: '⭐⭐⭐ 3 Stars' },
  { value: '4 Stars', label: '⭐⭐⭐⭐ 4 Stars' },
  { value: '5 Stars', label: '⭐⭐⭐⭐⭐ 5 Stars' },
]

export default function TestimonialItemsForm({ items }: TestimonialItemsFormProps) {
  const [testimonialItems, setTestimonialItems] = useState(items || [])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

  // ✅ Update local state when props change
  useEffect(() => {
    setTestimonialItems(items || [])
  }, [items])

  const refreshData = async () => {
    router.refresh()
    await new Promise(resolve => setTimeout(resolve, 100))
    router.refresh()
  }

  const handleCreate = async (formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      await createTestimonialItem(formData)
      setMessage('✅ Testimonial added successfully!')
      await refreshData()
    } catch (error) {
      setMessage('❌ Failed to add testimonial')
      console.error('Error creating testimonial:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: number, formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      await updateTestimonialItem(id, formData)
      setMessage('✅ Testimonial updated successfully!')
      setEditingId(null)
      await refreshData()
    } catch (error) {
      setMessage('❌ Failed to update testimonial')
      console.error('Error updating testimonial:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return
    
    setDeletingId(id)
    try {
      await deleteTestimonialItem(id)
      setTestimonialItems(testimonialItems.filter(item => item.id !== id))
      await refreshData()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const itemsCopy = Array.from(testimonialItems)
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1)
    itemsCopy.splice(result.destination.index, 0, reorderedItem)

    setTestimonialItems(itemsCopy)

    const ids = itemsCopy.map(item => item.id)
    await reorderTestimonialItems(ids)
    await refreshData()
  }

  const getRatingDisplay = (rating: string | null) => {
    if (!rating) return 'No rating'
    const option = ratingOptions.find(opt => opt.value === rating)
    return option ? option.label : rating
  }

  // ✅ Debug logging
  console.log('📊 TestimonialItemsForm items:', testimonialItems)
  console.log('📊 TestimonialItemsForm items length:', testimonialItems?.length)

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}
      {/* Create New Testimonial */}
      <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
          <input
            type="text"
            name="title"
            placeholder="John Doe"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            placeholder="CEO, Company"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
          <select
            name="rating"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select Rating</option>
            {ratingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
          <textarea
            name="content"
            placeholder="John is an exceptional developer..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
          >
            Add Testimonial
          </button>
        </div>
      </form>

      {/* ✅ Show message if no testimonials */}
      {testimonialItems.length === 0 ? (
        <div className="text-center py-8 bg-gray-700/30 rounded-lg">
          <p className="text-gray-400">No testimonials yet. Add your first one above!</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="testimonials">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {testimonialItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-gray-800 rounded-lg p-4 ${
                          snapshot.isDragging ? 'shadow-lg ring-2 ring-cyan-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span {...provided.dragHandleProps} className="text-gray-400 cursor-grab mt-2">
                            ⠿
                          </span>

                          {editingId === item.id ? (
                            <form
                              action={(formData) => handleUpdate(item.id, formData)}
                              className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3"
                            >
                              <div className="md:col-span-2">
                                <input
                                  type="url"
                                  name="imageUrl"
                                  defaultValue={item.imageUrl || ''}
                                  placeholder="Image URL"
                                  className="w-full px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                                />
                              </div>
                              <input
                                type="text"
                                name="title"
                                defaultValue={item.title}
                                placeholder="Name"
                                className="px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                                required
                              />
                              <input
                                type="text"
                                name="subtitle"
                                defaultValue={item.subtitle || ''}
                                placeholder="Subtitle"
                                className="px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                              />
                              <select
                                name="rating"
                                defaultValue={item.rating || ''}
                                className="px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                              >
                                <option value="">Select Rating</option>
                                {ratingOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <div className="md:col-span-2">
                                <textarea
                                  name="content"
                                  defaultValue={item.content || ''}
                                  placeholder="Content..."
                                  rows={2}
                                  className="w-full px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                                />
                              </div>
                              <div className="md:col-span-2 flex gap-2">
                                <button
                                  type="submit"
                                  disabled={loading}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="flex-1 flex items-start gap-4">
                                {item.imageUrl && (
                                  <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-700">
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <h4 className="font-semibold text-white">{item.title}</h4>
                                    {item.subtitle && (
                                      <span className="text-sm text-gray-400">{item.subtitle}</span>
                                    )}
                                    {item.rating && (
                                      <span className="text-sm text-yellow-400">
                                        {getRatingDisplay(item.rating)}
                                      </span>
                                    )}
                                  </div>
                                  {item.content && (
                                    <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                                      {item.content}
                                    </p>
                                  )}
                                </div>
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
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}