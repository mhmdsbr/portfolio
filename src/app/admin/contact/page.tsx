import { getContact } from '@/actions/contact'
import ContactForm from '@/components/admin/ContactForm'
import ContactMethodsForm from '@/components/admin/ContactMethodsForm'

export default async function ContactPage() {
  const contact = await getContact()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Contact Section</h1>
      <p className="-mt-6 text-sm text-gray-400">
        Edit shared section titles and visibility in Page layout.
      </p>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Form Settings</h2>
        <ContactForm initialData={contact} />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Public Contact Methods</h2>
        <p className="text-sm text-gray-400 mb-4">
          These methods provide the contact details shown across the portfolio.
          Drag to reorder them.
        </p>
        <ContactMethodsForm contactMethods={contact.contactMethods} />
      </div>
    </div>
  )
}