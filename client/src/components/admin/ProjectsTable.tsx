'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteProject, reorderProjects } from '@/actions/projects'
import { useState } from 'react'

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
  const [deletingId, setDeletingId] = useState<number | null>(null)

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

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No projects yet. Create your first one!</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tech
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {project.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-400">
                    {project.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {project.tech?.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs rounded bg-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech && project.tech.length > 3 && (
                      <span className="px-2 py-0.5 text-xs rounded bg-gray-700">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="text-red-400 hover:text-red-300 transition disabled:opacity-50"
                    >
                      {deletingId === project.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}