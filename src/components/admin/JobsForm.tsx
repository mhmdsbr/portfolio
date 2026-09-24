'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createJob, updateJob, deleteJob, reorderJobs } from '@/actions/summary'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface Job {
  id: number
  fromYear: number | null
  toYear: string | null
  jobTitle: string
  company: string
  description: string | null
  sortOrder: number | null
}

interface JobsFormProps {
  jobs: Job[]
}

export default function JobsForm({ jobs }: JobsFormProps) {
  const [items, setItems] = useState(jobs)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

  const handleCreate = async (formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      await createJob(formData)
      setMessage('✅ Experience added successfully!')
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to add experience')
      console.error('Error creating job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: number, formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      await updateJob(id, formData)
      setMessage('✅ Experience updated successfully!')
      setEditingId(null)
      router.refresh()
    } catch (error) {
      setMessage('❌ Failed to update experience')
      console.error('Error updating job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this job entry?')) return
    
    setDeletingId(id)
    try {
      await deleteJob(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting job:', error)
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
    await reorderJobs(ids)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}
      {/* Create New Job */}
      <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">From</label>
          <input
            type="number"
            name="fromYear"
            placeholder="2020"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">To</label>
          <input
            type="text"
            name="toYear"
            placeholder="Present"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            placeholder="Senior Developer"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
          <input
            type="text"
            name="company"
            placeholder="Tech Corp"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition whitespace-nowrap disabled:opacity-50"
        >
          Add Job
        </button>
      </form>

      {/* Job List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="jobs">
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
                      className={`bg-gray-800 rounded-lg p-4 ${
                        snapshot.isDragging ? 'shadow-lg ring-2 ring-cyan-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span {...provided.dragHandleProps} className="text-gray-400 cursor-grab mt-1">
                          ⠿
                        </span>

                        {editingId === item.id ? (
                          <form
                            action={(formData) => handleUpdate(item.id, formData)}
                            className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3"
                          >
                            <input
                              type="number"
                              name="fromYear"
                              defaultValue={item.fromYear || ''}
                              placeholder="2020"
                              className="px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                            />
                            <input
                              type="text"
                              name="toYear"
                              defaultValue={item.toYear || ''}
                              placeholder="Present"
                              className="px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                            />
                            <input
                              type="text"
                              name="jobTitle"
                              defaultValue={item.jobTitle}
                              placeholder="Job Title"
                              className="px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                              required
                            />
                            <input
                              type="text"
                              name="company"
                              defaultValue={item.company}
                              placeholder="Company"
                              className="px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                              required
                            />
                            <div className="md:col-span-4 flex gap-2">
                              <textarea
                                name="description"
                                defaultValue={item.description || ''}
                                placeholder="Description..."
                                rows={2}
                                className="flex-1 px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                              />
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
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                              <span className="text-gray-300">
                                {item.fromYear || 'N/A'} - {item.toYear || 'N/A'}
                              </span>
                              <span className="font-semibold text-white">{item.jobTitle}</span>
                              <span className="text-cyan-400">{item.company}</span>
                              <span className="text-gray-400 text-sm truncate">
                                {item.description || 'No description'}
                              </span>
                            </div>
                            <button
                              onClick={() => setEditingId(item.id)}
                              className="text-cyan-400 hover:text-cyan-300 transition ml-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                              className="text-red-400 hover:text-red-300 transition ml-2 disabled:opacity-50"
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
    </div>
  )
}