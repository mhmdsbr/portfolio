import { getServices } from '@/actions/services'
import ServicesForm from '@/components/admin/ServicesForm'
import ServiceItemsForm from '@/components/admin/ServiceItemsForm'

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Services</h1>

      {/* Services Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Services Section</h2>
        <ServicesForm initialData={services} />
      </div>

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