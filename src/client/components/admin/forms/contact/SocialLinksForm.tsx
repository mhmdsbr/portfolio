'use client'

import {
  createSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
  updateSocialLink,
} from '@/server/actions/admin/contact'
import { useCrudList } from '@/client/hooks/crudList'
import SortableCrudList, {
  CrudField,
  editInputClass,
  inputClass,
} from '@/client/components/admin/crud/SortableCrudList'
import { SOCIAL_PLATFORMS } from '@/shared/constants'
import type { SocialLinksFormProps } from './types'

const platformOptions = SOCIAL_PLATFORMS.map((platform) => ({
  value: platform,
  label: platform.charAt(0).toUpperCase() + platform.slice(1),
}))

const platformSelectOptions = (
  <>
    {platformOptions.map(({ value, label }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </>
)

export default function SocialLinksForm({ socialLinks }: SocialLinksFormProps) {
  const crud = useCrudList({
    items: socialLinks,
    actions: {
      create: createSocialLink,
      update: updateSocialLink,
      remove: deleteSocialLink,
      reorder: reorderSocialLinks,
    },
    noun: 'social link',
  })
  const defaultPlatform =
    SOCIAL_PLATFORMS.find(
      (platform) => !crud.items.some((link) => link.platform === platform),
    ) ?? SOCIAL_PLATFORMS[0]

  return (
    <SortableCrudList
      crud={crud}
      droppableId="socialLinks"
      createLabel="Add Social Link"
      createClassName="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-end"
      editClassName="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3"
      emptyState={
        <div className="text-center py-8 bg-gray-700/30 rounded-lg">
          <p className="text-gray-400">No social links yet. Add one above.</p>
        </div>
      }
      createFields={
        <>
          <CrudField label="Platform">
            <select name="platform" defaultValue={defaultPlatform} className={inputClass}>
              {platformSelectOptions}
            </select>
          </CrudField>
          <CrudField label="URL">
            <input
              type="text"
              name="url"
              placeholder="https://github.com/username"
              className={inputClass}
              required
            />
          </CrudField>
        </>
      }
      renderEditFields={(item) => (
        <>
          <select
            name="platform"
            defaultValue={item.platform}
            className={editInputClass}
          >
            {platformSelectOptions}
          </select>
          <input
            type="text"
            name="url"
            defaultValue={item.url}
            placeholder="Social link URL"
            className={editInputClass}
            required
          />
        </>
      )}
      renderItem={(item) => (
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-cyan-400 capitalize">{item.platform}</span>
          <span className="flex-1 min-w-0 truncate text-gray-300">{item.url}</span>
        </div>
      )}
    />
  )
}
