import type { ReactNode } from 'react'
import type { CrudList } from '@/client/hooks/crudList/types'

export interface CrudFieldProps {
  label: string
  className?: string
  children: ReactNode
}

export interface SortableCrudListProps<T extends { id: number }> {
  crud: CrudList<T>
  droppableId: string
  /** Fields of the "add" form. */
  createFields: ReactNode
  createLabel: string
  createClassName?: string
  /** Replaces the default classes of the "add" submit button. */
  createButtonClassName?: string
  /** Fields of the inline edit form for one item. */
  renderEditFields: (item: T) => ReactNode
  editClassName?: string
  /** Read-only content of a row, shown next to the Edit/Delete buttons. */
  renderItem: (item: T) => ReactNode
  /** Classes of the draggable row; defaults to a padded card. */
  rowClassName?: string
  /** Extra classes for the sortable list container (e.g. height limit + scroll). */
  listClassName?: string
  /** Vertical alignment of the row's contents. */
  align?: 'center' | 'start'
  /** Rendered instead of the list when there are no items. */
  emptyState?: ReactNode
}
