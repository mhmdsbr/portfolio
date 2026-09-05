import { getHero } from '@/actions/hero'
import HeroForm from '@/components/admin/HeroForm'

export default async function HeroPage() {
  const hero = await getHero()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hero Section</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <HeroForm initialData={hero} />
      </div>
    </div>
  )
}