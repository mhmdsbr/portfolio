import { getAbout } from '@/actions/about'
import AboutForm from '@/components/admin/AboutForm'
import AboutDetailsForm from '@/components/admin/AboutDetailsForm'
import ContactMethodsForm from '@/components/admin/ContactMethodsForm'
import SectionSettingsForm from '@/components/admin/SectionSettingsForm'

export default async function AboutPage() {
  const { section, profile, details, contactMethods } = await getAbout()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Profile & About</h1>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Section settings</h2>
        <SectionSettingsForm section={section} />
      </div>

      {/* Main About Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Main Content</h2>
        <AboutForm profile={profile} />
      </div>

      {/* Details / Stats */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Details / Stats</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <AboutDetailsForm details={details} />
      </div>

      {/* Contact methods are shared records, also managed on the Contact page */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Methods</h2>
        <p className="text-sm text-gray-400 mb-4">
          These records are shared with the Contact section. Tick the sections that
          should display each method; unticked methods are hidden. Drag to reorder.
        </p>
        <ContactMethodsForm contactMethods={contactMethods} />
      </div>
    </div>
  )
}
