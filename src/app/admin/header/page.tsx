import { getHeader } from '@/actions/header'
import HeaderForm from '@/components/admin/HeaderForm'

export default async function HeaderPage() {
  const { settings, sections } = await getHeader()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Page layout</h1>
      <p className="mb-6 text-sm text-gray-400">
        Choose which portfolio sections appear and set their order. This controls
        presentation only; it does not delete portfolio content.
      </p>
      <HeaderForm 
        initialSettings={{
          defaultTitle: settings.defaultTitle ?? 'Welcome',
        }}
        initialSections={sections.map((section) => ({
          ...section,
          sortOrder: section.sortOrder ?? 0,
        }))}
      />
    </div>
  )
}