export interface TestimonialItem {
  id: number
  imageUrl: string | null
  title: string
  subtitle: string | null
  rating: number | null
  body: string | null
  sortOrder: number | null
}

export interface TestimonialItemsFormProps {
  items: TestimonialItem[]
}
