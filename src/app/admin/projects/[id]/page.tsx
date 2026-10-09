import ProjectForm from '@/components/admin/ProjectForm'
import { getProjectCategories, getProject, updateProject } from '@/actions/projects'
import { notFound } from 'next/navigation'

interface EditProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  // ✅ Await params in Next.js 15
  const { id: idParam } = await params
  const id = parseInt(idParam, 10)
  
  if (isNaN(id)) {
    notFound()
  }
  
  const [project, categories] = await Promise.all([
    getProject(id),
    getProjectCategories(),
  ])
  
  if (!project) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <ProjectForm
        initialData={project}
        categories={categories.map(({ name }) => name)}
        onSubmit={async (formData: FormData) => {
          'use server'
          return await updateProject(id, formData)
        }}
        submitLabel="Update Project"
      />
    </div>
  )
}