import { getContact } from '@/actions/contact'
import ContactForm from '@/components/admin/ContactForm'

export default async function ContactPage() {
  const contact = await getContact()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Contact Section</h1>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Content</h2>
        <ContactForm initialData={contact} />
      </div>
    </div>
  )
}