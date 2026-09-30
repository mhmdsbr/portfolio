'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteProject, reorderProjects } from '@/actions/projects'
import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'

interface Project {
  id: number
  title: string
  category: string
  description: string | null
  image: string | null
  link: string | null
  github: string | null
  tech: string[] | null
  sortOrder: number | null
}

interface ProjectsTableProps {
  projects: Project[]
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter()
  const [items, setItems] = useState(projects)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setItems(projects)
  }, [projects])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project?')) return
    
    setDeletingId(id)
    try {
      await deleteProject(id)
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const onDragEnd = async (result: DropResult) => {
    const previousItems = items

    try {
      if (!result.destination || result.destination.index === result.source.index) return

      const reorderedItems = Array.from(items)
      const [movedItem] = reorderedItems.splice(result.source.index, 1)
      reorderedItems.splice(result.destination.index, 0, movedItem)

      setItems(reorderedItems)
      setMessage('')

      await reorderProjects(reorderedItems.map((item) => item.id))
      setMessage('✅ Project order saved successfully!')
      router.refresh()
    } catch (error) {
      setItems(previousItems)
      setMessage('❌ Failed to save project order')
      console.error('Error reordering projects:', error)
    }
  }

  return (
    <div className="rounded-lg bg-gray-800">
      {message && (
        <div className={`p-3 ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No projects yet. Create your first one!</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="projects">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 p-3"
                >
                  {items.map((project, index) => (
                    <Draggable
                      key={project.id}
                      draggableId={String(project.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <article
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-lg border border-gray-700 bg-gray-900 p-4 sm:grid-cols-[auto_minmax(0,1fr)_minmax(10rem,0.7fr)_minmax(10rem,1fr)_auto] ${
                            snapshot.isDragging ? 'shadow-lg ring-2 ring-cyan-500' : ''
                          }`}
                        >
                          <div>
                            <span
                              aria-hidden="true"
                              className="cursor-grab rounded p-2 text-xl text-gray-400"
                            >
                              ⠿
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h2 className="truncate font-semibold text-white">{project.title}</h2>
                            <span className="mt-1 inline-block rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-400 sm:hidden">
                              {project.category}
                            </span>
                          </div>
                          <div className="hidden sm:block">
                            <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-400">
                              {project.category}
                            </span>
                          </div>
                          <div className="col-start-2 flex flex-wrap gap-1 sm:col-auto">
                            {project.tech?.slice(0, 3).map((tech, i) => (
                              <span
                                key={i}
                                className="rounded bg-gray-800 px-2 py-0.5 text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.tech && project.tech.length > 3 && (
                              <span className="rounded bg-gray-800 px-2 py-0.5 text-xs">
                                +{project.tech.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="col-start-2 flex gap-3 sm:col-auto">
                            <Link
                              href={`/admin/projects/${project.id}`}
                              className="text-cyan-400 transition hover:text-cyan-300"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(project.id)}
                              disabled={deletingId === project.id}
                              className="text-red-400 transition hover:text-red-300 disabled:opacity-50"
                            >
                              {deletingId === project.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </article>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}