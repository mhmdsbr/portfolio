import { getProjects } from '@/actions/projects'
import { getAbout } from '@/actions/about'

export default async function AdminDashboard() {
  const projects = await getProjects()
  const about = await getAbout()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Total Projects</p>
          <p className="text-3xl font-bold mt-1">{projects.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Categories</p>
          <p className="text-3xl font-bold mt-1">
            {new Set(projects.map(p => p.category)).size}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">About</p>
          <p className="text-3xl font-bold mt-1 text-cyan-400">
            {about?.name || 'Not set'}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Quick Actions</p>
          <div className="mt-2 space-y-2">
            <a
              href="/admin/projects/new"
              className="block text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              + Add Project
            </a>
            <a
              href="/admin/about"
              className="block text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              ✏️ Edit About
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}