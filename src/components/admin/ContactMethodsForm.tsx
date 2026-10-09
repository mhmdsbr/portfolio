'use client'

import {
  createContactMethod,
  updateContactMethod,
  deleteContactMethod,
  reorderContactMethods,
} from '@/actions/contact'
import { useCrudList } from './crud/useCrudList'
import SortableCrudList, { CrudField, inputClass } from './crud/SortableCrudList'
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

const kindOptions = methodKinds.map((kind) => (
  <option key={kind.value} value={kind.value}>
    {kind.label}
  </option>
))

const compactEditClass =
  'px-2 py-1 bg-gray-700 border border-cyan-500 rounded text-white focus:outline-none'

export default function ContactMethodsForm({ contactMethods }: ContactMethodsFormProps) {
  const crud = useCrudList({
    items: contactMethods,
    actions: {
      create: createContactMethod,
      update: updateContactMethod,
      remove: deleteContactMethod,
      reorder: reorderContactMethods,
    },
    noun: 'contact information',
  })

  return (
    <SortableCrudList
      crud={crud}
      droppableId="contactInfo"
      createLabel="Add"
      createClassName="flex gap-2 items-end"
      rowClassName="p-3"
      editClassName="flex-1 flex items-center gap-3"
      createFields={
        <>
          <CrudField label="Type" className="flex-1">
            <select name="kind" defaultValue="other" className={inputClass}>
              {kindOptions}
            </select>
          </CrudField>
          <CrudField label="Label" className="flex-1">
            <input type="text" name="title" placeholder="e.g., Email" className={inputClass} required />
          </CrudField>
          <CrudField label="Value" className="flex-1">
            <input type="text" name="value" placeholder="e.g., name@example.com" className={inputClass} required />
          </CrudField>
          <fieldset className="flex gap-3 pb-2">
            <legend className="sr-only">Shown in</legend>
            {CONTACT_METHOD_SECTION_KINDS.map((section) => (
              <label key={section} className="flex items-center gap-1 text-sm text-gray-300">
                <input type="checkbox" name="sections" value={section} defaultChecked />
                {sectionLabels[section]}
              </label>
            ))}
          </fieldset>
        </>
      }
      renderEditFields={(item) => (
        <>
          <select name="kind" defaultValue={item.kind} className={compactEditClass}>
            {kindOptions}
          </select>
          <input
            type="text"
            name="title"
            defaultValue={item.title}
            className={`flex-1 ${compactEditClass}`}
            placeholder="Title"
            required
          />
          <input
            type="text"
            name="value"
            defaultValue={item.value}
            className={`flex-1 ${compactEditClass}`}
            placeholder="Content"
            required
          />
          <div className="flex gap-2">
            {CONTACT_METHOD_SECTION_KINDS.map((section) => (
              <label key={section} className="flex items-center gap-1 text-xs text-gray-300">
                <input
                  type="checkbox"
                  name="sections"
                  value={section}
                  defaultChecked={item.sections.includes(section)}
                />
                {sectionLabels[section]}
              </label>
            ))}
          </div>
        </>
      )}
      renderItem={(item) => (
        <div className="flex items-center gap-3">
          <span className="font-semibold w-24 text-cyan-400">{item.title}</span>
          <span className="flex-1 text-gray-300">{item.value}</span>
          <span className="text-xs text-gray-500">
            {item.sections.length > 0
              ? item.sections.map((section) => sectionLabels[section]).join(' · ')
              : 'Hidden'}
          </span>
        </div>
      )}
    />
  )
}
