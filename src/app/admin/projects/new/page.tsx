import ProjectForm from '@/components/admin/ProjectForm'
import { createProject } from '@/actions/projects'

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Project</h1>
      <ProjectForm
        onSubmit={createProject}
        submitLabel="Create Project"
      />
    </div>
  )
}