import { getTestimonials } from '@/actions/testimonials'
import TestimonialItemsForm from '@/components/admin/TestimonialItemsForm'
import SectionSettingsForm from '@/components/admin/SectionSettingsForm'

export default async function TestimonialsPage() {
  const { section, items } = await getTestimonials()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Testimonials</h1>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Section settings</h2>
        <SectionSettingsForm section={section} />
      </div>

      {/* Testimonial Items */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Testimonial Items</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <TestimonialItemsForm items={items} />
      </div>
    </div>
  )
}
