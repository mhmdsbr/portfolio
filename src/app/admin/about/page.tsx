import { getAbout } from '@/server/actions/admin/about'
import AboutForm from '@/client/components/admin/forms/about/AboutForm'
import AboutDetailsForm from '@/client/components/admin/forms/about/AboutDetailsForm'
import ContactMethodsForm from '@/client/components/admin/forms/contact/ContactMethodsForm'
import SectionSettingsForm from '@/client/components/admin/forms/sections/SectionSettingsForm'

export default async function AboutPage() {
  const { section, profile, details, contactMethods } = await getAbout()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Profile & About</h1>

      <div className="bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Section settings</h2>
        <SectionSettingsForm section={section} />
      </div>

      {/* Main About Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Main Content</h2>
        <AboutForm profile={profile} />
      </div>

      {/* Details / Stats */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Details / Stats</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <AboutDetailsForm details={details} />
      </div>

      {/* Contact methods are shared records, also managed on the Contact page */}
      <div className="bg-gray-800/50 rounded-lg p-6">
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
