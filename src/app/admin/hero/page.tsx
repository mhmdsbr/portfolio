import { getHero } from '@/actions/admin/hero'
import HeroForm from '@/components/admin/forms/hero/HeroForm'
import SectionSettingsForm from '@/components/admin/forms/sections/SectionSettingsForm'

export default async function HeroPage() {
  const { section, config, titles } = await getHero()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Hero Section</h1>

      <div className="bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Section settings</h2>
        <SectionSettingsForm section={section} />
      </div>

      <div className="bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Content</h2>
        <HeroForm config={config} titles={titles} />
      </div>
    </div>
  )
}
