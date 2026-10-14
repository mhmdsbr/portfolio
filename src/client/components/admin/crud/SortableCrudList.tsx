'use client'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import type {
  CrudFieldProps,
  SortableCrudListProps,
} from './types'

export const inputClass =
  'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500'
export const editInputClass =
  'px-3 py-2 bg-gray-700 border border-cyan-500 rounded-md text-white focus:outline-none'

export function CrudField({
  label,
  className,
  children,
}: CrudFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function SortableCrudList<T extends { id: number }>({
  crud,
  droppableId,
  createFields,
  createLabel,
  createClassName = 'grid grid-cols-1 md:grid-cols-4 gap-3 items-end',
  createButtonClassName = 'bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition whitespace-nowrap disabled:opacity-50',
  renderEditFields,
  editClassName = 'flex-1 grid grid-cols-1 md:grid-cols-3 gap-3',
  renderItem,
  rowClassName = 'p-4',
  listClassName = '',
  align = 'center',
  emptyState,
}: SortableCrudListProps<T>) {
  const { items, editingId, loading, message, deletingId } = crud

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded ${!message.startsWith('✅') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
        >
          {message}
        </div>
      )}

      <form action={crud.create} className={createClassName}>
        {createFields}
        <button
          type="submit"
          disabled={loading}
          className={createButtonClassName}
        >
          {createLabel}
        </button>
      </form>

      {items.length === 0 && emptyState ? (
        emptyState
      ) : (
      <DragDropContext onDragEnd={crud.reorder}>
        <Droppable droppableId={droppableId}>
          {(droppable) => (
            <div
              {...droppable.droppableProps}
              ref={droppable.innerRef}
              data-lenis-prevent={listClassName ? true : undefined}
              className={`space-y-2 ${listClassName}`}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(draggable, snapshot) => (
                    <div
                      ref={draggable.innerRef}
                      {...draggable.draggableProps}
                      className={`bg-gray-800/50 rounded-lg ${rowClassName} ${
                        snapshot.isDragging ? 'shadow-lg ring-2 ring-cyan-500' : ''
                      }`}
                    >
                      <div className={`flex gap-3 ${align === 'start' ? 'items-start' : 'items-center'}`}>
                        <span
                          {...draggable.dragHandleProps}
                          className={`text-gray-400 cursor-grab ${align === 'start' ? 'mt-2' : ''}`}
                        >
                          ⠿
                        </span>

                        {editingId === item.id ? (
                          <form
                            action={(formData) => crud.update(item.id, formData)}
                            className={editClassName}
                          >
                            {renderEditFields(item)}
                            <div className="md:col-span-full flex gap-2">
                              <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={crud.cancelEdit}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="flex-1 min-w-0">{renderItem(item)}</div>
                            <button
                              type="button"
                              onClick={() => crud.startEdit(item.id)}
                              className="text-cyan-400 hover:text-cyan-300 transition"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => crud.remove(item.id)}
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
              {droppable.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      )}
    </div>
  )
}
