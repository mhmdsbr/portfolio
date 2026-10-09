'use client'

import { useState } from 'react'

const NEW_CATEGORY = '__new__'

interface CategorySelectProps {
  categories: string[]
  value: string
  onChange: (value: string) => void
  id?: string
  // When set, the chosen category name is submitted in a hidden input
  name?: string
  ariaLabel?: string
  selectClassName?: string
  inputClassName?: string
}

const defaultSelectClass =
  'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500'

// Picks one of the existing project categories, or lets the user type a new
// one. Names are matched case-insensitively, like project_categories.name.
export default function CategorySelect({
  categories,
  value,
  onChange,
  id,
  name,
  ariaLabel,
  selectClassName = defaultSelectClass,
  inputClassName = defaultSelectClass,
}: CategorySelectProps) {
  const existing = categories.find(
    (category) => category.toLowerCase() === value.trim().toLowerCase(),
  )
  const [creating, setCreating] = useState(value.trim() !== '' && !existing)

  return (
    <div className="space-y-2">
      <select
        id={id}
        aria-label={ariaLabel}
        value={creating ? NEW_CATEGORY : (existing ?? '')}
        onChange={(event) => {
          if (event.target.value === NEW_CATEGORY) {
            setCreating(true)
            onChange('')
          } else {
            setCreating(false)
            onChange(event.target.value)
          }
        }}
        className={selectClassName}
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
        <option value={NEW_CATEGORY}>+ New category…</option>
      </select>
      {creating && (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="New category name"
          aria-label={ariaLabel ? `${ariaLabel} name` : 'New category name'}
          className={inputClassName}
          required
        />
      )}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  )
}
