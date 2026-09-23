import { getFooter, updateFooter } from '@/actions/footer'
import FooterForm from '@/components/admin/FooterForm'

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