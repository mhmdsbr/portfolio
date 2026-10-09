'use client'

import { createDetail, updateDetail, deleteDetail, reorderDetails } from '@/actions/about'
import { useCrudList } from './crud/useCrudList'
import SortableCrudList, { CrudField, inputClass } from './crud/SortableCrudList'

interface Detail {
  id: number
  number: number
  title: string
  sortOrder: number | null
}

interface AboutDetailsFormProps {
  details: Detail[]
}

const compactEditClass =
  'px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white focus:outline-none'

export default function AboutDetailsForm({ details }: AboutDetailsFormProps) {
  const crud = useCrudList({
    items: details,
    actions: {
      create: createDetail,
      update: updateDetail,
      remove: deleteDetail,
      reorder: reorderDetails,
    },
    noun: 'about detail',
  })

  return (
    <SortableCrudList
      crud={crud}
      droppableId="details"
      createLabel="Add"
      createClassName="flex gap-2 items-end"
      rowClassName="p-3"
      editClassName="flex-1 flex items-center gap-3"
      createFields={
        <>
          <CrudField label="Number">
            <input
              type="number"
              name="number"
              placeholder="5"
              className={inputClass.replace('w-full', 'w-24')}
              required
            />
          </CrudField>
          <CrudField label="Title" className="flex-1">
            <input type="text" name="title" placeholder="Years Experience" className={inputClass} required />
          </CrudField>
        </>
      }
      renderEditFields={(item) => (
        <>
          <input
            type="number"
            name="number"
            defaultValue={item.number}
            className={`w-24 ${compactEditClass}`}
            required
          />
          <input
            type="text"
            name="title"
            defaultValue={item.title}
            placeholder="Title"
            className={`flex-1 ${compactEditClass}`}
            required
          />
        </>
      )}
      renderItem={(item) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-cyan-400 w-16">{item.number}</span>
          <span className="flex-1 text-gray-300">{item.title}</span>
        </div>
      )}
    />
  )
}
