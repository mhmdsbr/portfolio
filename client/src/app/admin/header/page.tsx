import { getHeader, updateHeaderSection, updateHeaderSettings, reorderHeaderSections } from '@/actions/header'
import HeaderForm from '@/components/admin/HeaderForm'

export default async function HeaderPage() {
  const { settings, sections } = await getHeader()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Header Settings</h1>
      <HeaderForm 
        initialSettings={settings} 
        initialSections={sections}
      />
    </div>
  )
}