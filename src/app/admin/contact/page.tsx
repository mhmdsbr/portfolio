import { getContact } from '@/actions/contact'
import ContactForm from '@/components/admin/ContactForm'
import ContactMethodsForm from '@/components/admin/ContactMethodsForm'
import SectionSettingsForm from '@/components/admin/SectionSettingsForm'

export default async function ContactPage() {
  const { section, config, contactMethods } = await getContact()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Contact Section</h1>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Section settings</h2>
        <SectionSettingsForm section={section} />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Form Settings</h2>
        <ContactForm config={config} />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Methods</h2>
        <p className="text-sm text-gray-400 mb-4">
          These records are shared with the About section. Tick the sections that
          should display each method; unticked methods are hidden. Drag to reorder.
        </p>
        <ContactMethodsForm contactMethods={contactMethods} />
      </div>
    </div>
  )
}
