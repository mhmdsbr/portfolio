import { getProjects } from '@/actions/projects'
import Link from 'next/link'
import ProjectsTable from '@/components/admin/ProjectsTable'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          + New Project
        </Link>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  )
}