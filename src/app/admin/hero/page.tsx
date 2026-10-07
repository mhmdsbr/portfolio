import { getHero } from '@/actions/hero'
import HeroForm from '@/components/admin/HeroForm'

export default async function HeroPage() {
  const hero = await getHero()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold mb-6">Hero Section</h1>
      <p className="-mt-6 mb-6 text-sm text-gray-400">
        Shared section titles and visibility are managed in Page layout. Rotating hero titles,
        subtitles, location, and logo are specific to this design.
      </p>
      <div className="bg-gray-800 rounded-lg p-6">
        <HeroForm initialData={hero} />
      </div>
    </div>
  )
}