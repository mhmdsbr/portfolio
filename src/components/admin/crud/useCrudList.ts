'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DropResult } from '@hello-pangea/dnd'
import type { ActionResult } from '@/server/action-result'

export interface CrudActions {
  create: (formData: FormData) => Promise<ActionResult<unknown>>
  update: (id: number, formData: FormData) => Promise<ActionResult<unknown>>
  remove: (id: number) => Promise<ActionResult<unknown>>
  reorder: (ids: number[]) => Promise<ActionResult<unknown>>
}

interface UseCrudListOptions<T extends { id: number }> {
  items: T[]
  actions: CrudActions
  /** Lower-case singular name used in messages, e.g. "service". */
  noun: string
}

export function useCrudList<T extends { id: number }>({
  items: initialItems,
  actions,
  noun,
}: UseCrudListOptions<T>) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const label = noun.charAt(0).toUpperCase() + noun.slice(1)

  const refresh = async () => {
    router.refresh()
    await new Promise((resolve) => setTimeout(resolve, 100))
    router.refresh()
  }

  const create = async (formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      const result = await actions.create(formData)
      if (!result.success) { setMessage(`❌ ${result.error}`); return }
      setMessage(`✅ ${label} added successfully!`)
      await refresh()
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : `Failed to add ${noun}`}`)
      console.error(`Error creating ${noun}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const update = async (id: number, formData: FormData) => {
    setLoading(true)
    setMessage('')
    try {
      const result = await actions.update(id, formData)
      if (!result.success) { setMessage(`❌ ${result.error}`); return }
      setMessage(`✅ ${label} updated successfully!`)
      setEditingId(null)
      await refresh()
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : `Failed to update ${noun}`}`)
      console.error(`Error updating ${noun}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: number) => {
    if (!confirm(`Delete this ${noun}?`)) return

    setDeletingId(id)
    try {
      const result = await actions.remove(id)
      if (!result.success) { setMessage(`❌ ${result.error}`); return }
      setMessage(`✅ ${label} deleted successfully!`)
      setItems((current) => current.filter((item) => item.id !== id))
      await refresh()
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : `Failed to delete ${noun}`}`)
      console.error(`Error deleting ${noun}:`, error)
    } finally {
      setDeletingId(null)
    }
  }

  const reorder = async (result: DropResult) => {
    if (!result.destination) return

    const previous = items
    const reordered = Array.from(items)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setItems(reordered)

    try {
      const result = await actions.reorder(reordered.map((item) => item.id))
      if (!result.success) {
        setItems(previous)
        setMessage(`❌ ${result.error}`)
        return
      }
    } catch (error) {
      setItems(previous)
      setMessage(`❌ ${error instanceof Error ? error.message : `Failed to reorder ${noun}s`}`)
      console.error(`Error reordering ${noun}s:`, error)
      return
    }
    await refresh()
  }

  return {
    items,
    editingId,
    loading,
    message,
    deletingId,
    startEdit: (id: number) => setEditingId(id),
    cancelEdit: () => setEditingId(null),
    create,
    update,
    remove,
    reorder,
  }
}

export type CrudList<T extends { id: number }> = ReturnType<typeof useCrudList<T>>
