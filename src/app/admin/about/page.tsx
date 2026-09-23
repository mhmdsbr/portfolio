import { getAbout } from '@/actions/about'
import AboutForm from '@/components/admin/AboutForm'
import AboutContactInfoForm from '@/components/admin/AboutContactInfoForm'
import AboutDetailsForm from '@/components/admin/AboutDetailsForm'

export default async function AboutPage() {
  const about = await getAbout()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">About Section</h1>

      {/* Main About Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Main Content</h2>
        <AboutForm initialData={about} />
      </div>

      {/* Contact Information */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <AboutContactInfoForm contactInfo={about.contactInfo || []} />
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