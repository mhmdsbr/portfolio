import { getServices } from '@/actions/services'
import ServiceItemsForm from '@/components/admin/ServiceItemsForm'

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Services</h1>
      <p className="-mt-6 text-sm text-gray-400">
        Edit the shared section titles and visibility in Page layout.
      </p>

      {/* Service Items */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Service Items</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <ServiceItemsForm items={services.items || []} />
      </div>
    </div>
  )
}