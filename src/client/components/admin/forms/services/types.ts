import type { ServiceIcon } from '@/shared/types'

export interface ServiceItem {
  id: number
  title: string
  description: string | null
  icon: ServiceIcon | null
  sortOrder: number | null
}

export interface ServiceItemsFormProps {
  items: ServiceItem[]
}
