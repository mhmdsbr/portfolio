'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createServiceItem, updateServiceItem, deleteServiceItem, reorderServiceItems } from '@/actions/services'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { 
  FiMonitor, 
  FiPenTool, 
  FiPieChart, 
  FiBox
} from 'react-icons/fi'

interface ServiceItem {
  id: number
  title: string
  content: string | null
  icon: string | null
  sortOrder: number | null
}

interface ServiceItemsFormProps {
  items: ServiceItem[]
}

const iconOptions = [
  { value: 'palette', label: 'Palette', icon: FiMonitor },
  { value: 'desktop', label: 'Desktop', icon: FiMonitor },
  { value: 'pen-ruler', label: 'Pencil Ruler', icon: FiPenTool },
  { value: 'paintbrush', label: 'Paint Brush', icon: FiPenTool },
  { value: 'chart-area', label: 'Chart Area', icon: FiPieChart },
  { value: 'bullhorn', label: 'Bull Horn', icon: FiPieChart },
]

export default function ServiceItemsForm({ items }: ServiceItemsFormProps) {
  const [serviceItems, setServiceItems] = useState(items)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

  const refreshData = async () => {
    router.refresh()
    await new Promise(resolve => setTimeout(resolve, 100))
    router.refresh()
  }

  const handleCreate = async (formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      await createServiceItem(formData)
      setMessage('✅ Service added successfully!')
      await refreshData()
    } catch (error) {
      setMessage('❌ Failed to add service')
      console.error('Error creating service item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: number, formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      await updateServiceItem(id, formData)
      setMessage('✅ Service updated successfully!')
      setEditingId(null)
      await refreshData()
    } catch (error) {
      setMessage('❌ Failed to update service')
      console.error('Error updating service item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this service?')) return
    
    setDeletingId(id)
    try {
      await deleteServiceItem(id)
      setServiceItems(serviceItems.filter(item => item.id !== id))
      await refreshData()
    } catch (error) {
      console.error('Error deleting service item:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const itemsCopy = Array.from(serviceItems)
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1)
    itemsCopy.splice(result.destination.index, 0, reorderedItem)

    setServiceItems(itemsCopy)

    const ids = itemsCopy.map(item => item.id)
    await reorderServiceItems(ids)
    await refreshData()
  }

  const getIconComponent = (iconName: string | null) => {
    const option = iconOptions.find(opt => opt.value === iconName)
    return option ? option.icon : FiBox
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}
      {/* Create New Service */}
      <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Web Development"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
          <input
            type="text"
            name="content"
            placeholder="Building responsive websites..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Icon</label>
          <select
            name="icon"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select Icon</option>
            {iconOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition whitespace-nowrap disabled:opacity-50"
        >
          Add Service
        </button>
      </form>

      {/* Service List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="services">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {serviceItems.map((item, index) => {
                const IconComponent = getIconComponent(item.icon)
                
                return (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-gray-800 rounded-lg p-4 ${
                          snapshot.isDragging ? 'shadow-lg ring-2 ring-cyan-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span {...provided.dragHandleProps} className="text-gray-400 cursor-grab">
                            ⠿
                          </span>

                          {editingId === item.id ? (
                            <form
                              action={(formData) => handleUpdate(item.id, formData)}
                              className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3"
                            >
                              <input
                                type="text"
                                name="title"
                                defaultValue={item.title}
                                placeholder="Title"
                                className="px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                                required
                              />
                              <input
                                type="text"
                                name="content"
                                defaultValue={item.content || ''}
                                placeholder="Content"
                                className="px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                              />
                              <select
                                name="icon"
                                defaultValue={item.icon || ''}
                                className="px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none"
                              >
                                <option value="">Select Icon</option>
                                {iconOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <div className="md:col-span-3 flex gap-2">
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
                              <div className="flex-1 flex items-center gap-4">
                                <div className="text-2xl text-cyan-400">
                                  <IconComponent />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white">{item.title}</h4>
                                  <p className="text-sm text-gray-400">{item.content || 'No description'}</p>
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
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}