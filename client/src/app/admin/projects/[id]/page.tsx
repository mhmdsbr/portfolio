import ProjectForm from '@/components/admin/ProjectForm'
import { getProject, updateProject } from '@/actions/projects'
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
  
  const project = await getProject(id)
  
  if (!project) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <ProjectForm
        initialData={project}
        onSubmit={async (formData: FormData) => {
          'use server'
          return await updateProject(id, formData)
        }}
        submitLabel="Update Project"
      />
    </div>
  )
}