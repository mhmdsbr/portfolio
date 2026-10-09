import { getServices } from '@/actions/services'
import ServiceItemsForm from '@/components/admin/ServiceItemsForm'
import SectionSettingsForm from '@/components/admin/SectionSettingsForm'

export default async function ServicesPage() {
  const { section, items } = await getServices()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Services</h1>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Section settings</h2>
        <SectionSettingsForm section={section} />
      </div>

      {/* Service Items */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Service Items</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <ServiceItemsForm items={items} />
      </div>
    </div>
  )
}
