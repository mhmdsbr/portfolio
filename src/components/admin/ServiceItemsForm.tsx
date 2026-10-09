'use client'

import { createServiceItem, updateServiceItem, deleteServiceItem, reorderServiceItems } from '@/actions/services'
import { useCrudList } from './crud/useCrudList'
import SortableCrudList, { CrudField, inputClass, editInputClass } from './crud/SortableCrudList'
import { 
  FiMonitor, 
  FiPenTool, 
  FiPieChart, 
  FiBox
} from 'react-icons/fi'
import { SERVICE_ICONS, type ServiceIcon } from '@/lib/db/constants'

interface ServiceItem {
  id: number
  title: string
  description: string | null
  icon: ServiceIcon | null
  sortOrder: number | null
}

interface ServiceItemsFormProps {
  items: ServiceItem[]
}

// Typed so a new ServiceIcon value fails to compile until it is listed here.
const iconDetails: Record<ServiceIcon, { label: string; icon: typeof FiMonitor }> = {
  palette: { label: 'Palette', icon: FiMonitor },
  desktop: { label: 'Desktop', icon: FiMonitor },
  'pen-ruler': { label: 'Pencil Ruler', icon: FiPenTool },
  paintbrush: { label: 'Paint Brush', icon: FiPenTool },
  'chart-area': { label: 'Chart Area', icon: FiPieChart },
  bullhorn: { label: 'Bull Horn', icon: FiPieChart },
}

const iconOptions = SERVICE_ICONS.map((value) => ({ value, ...iconDetails[value] }))

const getIconComponent = (iconName: string | null) =>
  iconOptions.find((opt) => opt.value === iconName)?.icon ?? FiBox

const iconSelectOptions = (
  <>
    <option value="">Select Icon</option>
    {iconOptions.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </>
)

export default function ServiceItemsForm({ items }: ServiceItemsFormProps) {
  const crud = useCrudList({
    items,
    actions: {
      create: createServiceItem,
      update: updateServiceItem,
      remove: deleteServiceItem,
      reorder: reorderServiceItems,
    },
    noun: 'service',
  })

  return (
    <SortableCrudList
      crud={crud}
      droppableId="services"
      createLabel="Add Service"
      createFields={
        <>
          <CrudField label="Title">
            <input type="text" name="title" placeholder="Web Development" className={inputClass} required />
          </CrudField>
          <CrudField label="Description">
            <input type="text" name="description" placeholder="Building responsive websites..." className={inputClass} />
          </CrudField>
          <CrudField label="Icon">
            <select name="icon" className={inputClass}>
              {iconSelectOptions}
            </select>
          </CrudField>
        </>
      }
      renderEditFields={(item) => (
        <>
          <input type="text" name="title" defaultValue={item.title} placeholder="Title" className={editInputClass} required />
          <input type="text" name="description" defaultValue={item.description || ''} placeholder="Description" className={editInputClass} />
          <select name="icon" defaultValue={item.icon || ''} className={editInputClass}>
            {iconSelectOptions}
          </select>
        </>
      )}
      renderItem={(item) => {
        const IconComponent = getIconComponent(item.icon)
        return (
          <div className="flex items-center gap-4">
            <div className="text-2xl text-cyan-400">
              <IconComponent />
            </div>
            <div>
              <h4 className="font-semibold text-white">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.description || 'No description'}</p>
            </div>
          </div>
        )
      }}
    />
  )
}

