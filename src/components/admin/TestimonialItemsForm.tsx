'use client'

import { createTestimonialItem, updateTestimonialItem, deleteTestimonialItem, reorderTestimonialItems } from '@/actions/testimonials'
import Image from 'next/image'
import { useCrudList } from './crud/useCrudList'
import SortableCrudList, { CrudField, inputClass, editInputClass } from './crud/SortableCrudList'

interface TestimonialItem {
  id: number
  imageUrl: string | null
  title: string
  subtitle: string | null
  rating: number | null
  body: string | null
  sortOrder: number | null
}

interface TestimonialItemsFormProps {
  items: TestimonialItem[]
}

const ratingOptions = [
  { value: '1', label: '⭐ 1 Star' },
  { value: '2', label: '⭐⭐ 2 Stars' },
  { value: '3', label: '⭐⭐⭐ 3 Stars' },
  { value: '4', label: '⭐⭐⭐⭐ 4 Stars' },
  { value: '5', label: '⭐⭐⭐⭐⭐ 5 Stars' },
]

const ratingSelectOptions = (
  <>
    <option value="">Select Rating</option>
    {ratingOptions.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </>
)

const getRatingDisplay = (rating: number | null) => {
  if (rating === null) return 'No rating'
  const option = ratingOptions.find((opt) => Number(opt.value) === rating)
  return option?.label ?? `${rating} Stars`
}

export default function TestimonialItemsForm({ items }: TestimonialItemsFormProps) {
  const crud = useCrudList({
    items: items || [],
    actions: {
      create: createTestimonialItem,
      update: updateTestimonialItem,
      remove: deleteTestimonialItem,
      reorder: reorderTestimonialItems,
    },
    noun: 'testimonial',
  })

  return (
    <SortableCrudList
      crud={crud}
      droppableId="testimonials"
      align="start"
      createLabel="Add Testimonial"
      createClassName="grid grid-cols-1 md:grid-cols-2 gap-3"
      createButtonClassName="md:col-span-2 justify-self-start bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
      editClassName="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3"
      emptyState={
        <div className="text-center py-8 bg-gray-700/30 rounded-lg">
          <p className="text-gray-400">No testimonials yet. Add your first one above!</p>
        </div>
      }
      createFields={
        <>
          <CrudField label="Image URL" className="md:col-span-2">
            <input type="url" name="imageUrl" placeholder="https://example.com/avatar.jpg" className={inputClass} />
          </CrudField>
          <CrudField label="Name *">
            <input type="text" name="title" placeholder="John Doe" className={inputClass} required />
          </CrudField>
          <CrudField label="Subtitle">
            <input type="text" name="subtitle" placeholder="CEO, Company" className={inputClass} />
          </CrudField>
          <CrudField label="Rating">
            <select name="rating" className={inputClass}>
              {ratingSelectOptions}
            </select>
          </CrudField>
          <CrudField label="Content" className="md:col-span-2">
            <textarea name="body" placeholder="John is an exceptional developer..." rows={3} className={inputClass} />
          </CrudField>
        </>
      }
      renderEditFields={(item) => (
        <>
          <div className="md:col-span-2">
            <input
              type="url"
              name="imageUrl"
              defaultValue={item.imageUrl || ''}
              placeholder="Image URL"
              className={`w-full ${editInputClass}`}
            />
          </div>
          <input type="text" name="title" defaultValue={item.title} placeholder="Name" className={editInputClass} required />
          <input type="text" name="subtitle" defaultValue={item.subtitle || ''} placeholder="Subtitle" className={editInputClass} />
          <select name="rating" defaultValue={item.rating || ''} className={editInputClass}>
            {ratingSelectOptions}
          </select>
          <div className="md:col-span-2">
            <textarea
              name="body"
              defaultValue={item.body || ''}
              placeholder="Content..."
              rows={2}
              className={`w-full ${editInputClass}`}
            />
          </div>
        </>
      )}
      renderItem={(item) => (
        <div className="flex items-start gap-4">
          {item.imageUrl && (
            <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-700">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="font-semibold text-white">{item.title}</h4>
              {item.subtitle && <span className="text-sm text-gray-400">{item.subtitle}</span>}
              {item.rating && (
                <span className="text-sm text-yellow-400">{getRatingDisplay(item.rating)}</span>
              )}
            </div>
            {item.body && <p className="text-sm text-gray-300 mt-1 line-clamp-2">{item.body}</p>}
          </div>
        </div>
      )}
    />
  )
}
