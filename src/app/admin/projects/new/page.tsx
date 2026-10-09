import ProjectForm from '@/components/admin/ProjectForm'
import { createProject, getProjectCategories } from '@/actions/projects'
import { requireAuth } from '@/lib/auth'

export default async function NewProjectPage() {
  await requireAuth()
  const categories = await getProjectCategories()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Project</h1>
      <ProjectForm
        categories={categories.map(({ name }) => name)}
        onSubmit={createProject}
        submitLabel="Create Project"
      />
    </div>
  )
}