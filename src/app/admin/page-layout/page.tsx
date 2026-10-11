import { getPageLayout } from '@/actions/admin/page-layout'
import PageLayoutForm from '@/components/admin/forms/page-layout/PageLayoutForm'

export default async function PageLayoutPage() {
  const { sections } = await getPageLayout()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Page layout</h1>
      <p className="mb-6 text-sm text-gray-400">
        Choose which portfolio sections appear and set their order. This controls
        presentation only; it does not delete portfolio content.
      </p>
      <PageLayoutForm
        initialSections={sections.map(({ kind, navigationTitle, title, sortOrder, isEnabled }) => ({
          kind,
          navigationTitle,
          title,
          sortOrder,
          isEnabled,
        }))}
      />
    </div>
  )
}