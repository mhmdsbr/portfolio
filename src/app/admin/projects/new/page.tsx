import ProjectForm from '@/components/admin/forms/projects/ProjectForm'
import { createProject, getProjectCategories } from '@/actions/admin/projects'
import { requireAuth } from '@/server/auth/session'

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