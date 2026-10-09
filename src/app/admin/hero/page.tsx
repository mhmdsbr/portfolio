import { getHero } from '@/actions/hero'
import HeroForm from '@/components/admin/HeroForm'
import SectionSettingsForm from '@/components/admin/SectionSettingsForm'

export default async function HeroPage() {
  const { section, config, titles } = await getHero()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Hero Section</h1>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Section settings</h2>
        <SectionSettingsForm section={section} />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Content</h2>
        <HeroForm config={config} titles={titles} />
      </div>
    </div>
  )
}
