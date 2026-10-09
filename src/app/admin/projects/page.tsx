import { getProjectsOverview } from '@/actions/projects'
import Link from 'next/link'
import ProjectsTable from '@/components/admin/ProjectsTable'
import SectionSettingsForm from '@/components/admin/SectionSettingsForm'

export default async function ProjectsPage() {
  const { section, projects, categories } = await getProjectsOverview()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          + New Project
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Section settings</h2>
        <SectionSettingsForm section={section} />
      </div>

      <ProjectsTable
        projects={projects}
        categories={categories.map(({ name }) => name)}
      />
    </div>
  )
}
