import { getTestimonials } from '@/actions/testimonials'
import TestimonialItemsForm from '@/components/admin/TestimonialItemsForm'

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Testimonials</h1>
      <p className="-mt-6 text-sm text-gray-400">
        Edit the shared section titles and visibility in Page layout.
      </p>

      {/* Testimonial Items */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Testimonial Items</h2>
        <p className="text-sm text-gray-400 mb-4">
          Drag to reorder. Click Edit to modify.
        </p>
        <TestimonialItemsForm items={testimonials.items || []} />
      </div>
    </div>
  )
}