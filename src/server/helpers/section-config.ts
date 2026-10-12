import { SECTION_CONFIG_DEFAULTS } from '@/shared/constants'
import type { SectionConfigMap, SectionKind } from '@/shared/types'

/** Fills defaults for stored configs so readers never see missing keys. */
export function readSectionConfig<K extends SectionKind>(
  kind: K,
  stored: unknown,
): SectionConfigMap[K] {
  const base = SECTION_CONFIG_DEFAULTS[kind]
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
    return { ...base }
  }
  const values = stored as Record<string, unknown>
  const result: Record<string, unknown> = { ...base }
  for (const key of Object.keys(base)) {
    const value = values[key]
    result[key] = typeof value === 'string' && value ? value : null
  }
  return result as SectionConfigMap[K]
}
