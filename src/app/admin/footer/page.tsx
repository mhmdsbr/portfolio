import { getFooter } from '@/server/actions/admin/footer'
import FooterForm from '@/client/components/admin/forms/footer/FooterForm'

export default async function FooterPage() {
  const footer = await getFooter()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Footer Settings</h1>
      <FooterForm
        initialData={{
          ...footer,
          companyName: footer.companyName ?? 'Your Company',
        }}
      />
    </div>
  )
}