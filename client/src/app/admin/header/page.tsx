import { getHeader, updateHeaderSection, updateHeaderSettings, reorderHeaderSections } from '@/actions/header'
import HeaderForm from '@/components/admin/HeaderForm'

export default async function HeaderPage() {
  const { settings, sections } = await getHeader()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Header Settings</h1>
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