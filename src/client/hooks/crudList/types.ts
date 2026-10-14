import type { DropResult } from '@hello-pangea/dnd'
import type { ActionResult } from '@/shared/types'

export interface CrudActions {
  create: (formData: FormData) => Promise<ActionResult<unknown>>
  update: (id: number, formData: FormData) => Promise<ActionResult<unknown>>
  remove: (id: number) => Promise<ActionResult<unknown>>
  reorder: (ids: number[]) => Promise<ActionResult<unknown>>
}

export interface UseCrudListOptions<T extends { id: number }> {
  items: T[]
  actions: CrudActions
  /** Lower-case singular name used in status messages, e.g. "service". */
  noun: string
}

export interface CrudList<T extends { id: number }> {
  items: T[]
  editingId: number | null
  loading: boolean
  message: string
  deletingId: number | null
  startEdit: (id: number) => void
  cancelEdit: () => void
  create: (formData: FormData) => Promise<void>
  update: (id: number, formData: FormData) => Promise<void>
  remove: (id: number) => Promise<void>
  reorder: (result: DropResult) => Promise<void>
}
