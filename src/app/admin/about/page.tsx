import { getAbout } from '@/actions/about'
import AboutForm from '@/components/admin/AboutForm'
import AboutDetailsForm from '@/components/admin/AboutDetailsForm'

export default async function AboutPage() {
  const about = await getAbout()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Profile & About</h1>
      <p className="-mt-6 text-sm text-gray-400">
        Edit shared section titles and visibility in Page layout.
      </p>

      {/* Main About Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Main Content</h2>
        <AboutForm initialData={about} />
      </div>

      {/* Details / Stats */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Details / Stats</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <AboutDetailsForm details={about.details || []} />
      </div>
    </div>
  )
}