import {
  ASSET_URL_PATTERN,
  LINK_URL_PATTERN,
  SLUG_PATTERN,
  WEB_URL_PATTERN,
} from '@/lib/db/constants'

const patterns = {
  web: new RegExp(WEB_URL_PATTERN),
  asset: new RegExp(ASSET_URL_PATTERN),
  link: new RegExp(LINK_URL_PATTERN),
  slug: new RegExp(SLUG_PATTERN),
}

export type UrlKind = 'web' | 'asset' | 'link'

/** Trims a form value; empty or non-string input becomes null. */
export function optionalText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  return value.trim() || null
}

/** Trims a required form value and throws when it is empty. */
export function requiredText(value: unknown, label: string): string {
  const text = optionalText(value)
  if (!text) throw new Error(`${label} is required`)
  return text
}

/** Returns a validated URL, null when empty, and throws when malformed. */
export function optionalUrl(
  value: unknown,
  label: string,
  kind: UrlKind = 'link',
): string | null {
  const url = optionalText(value)
  if (url === null) return null
  if (!patterns[kind].test(url)) {
    throw new Error(`${label} must be a valid URL or site path`)
  }
  return url
}

/** Parses an integer within bounds; empty input becomes null. */
export function optionalInteger(
  value: unknown,
  label: string,
  { min, max }: { min?: number; max?: number } = {},
): number | null {
  const text = optionalText(value)
  if (text === null) return null
  const number = Number(text)
  if (
    !Number.isInteger(number) ||
    (min !== undefined && number < min) ||
    (max !== undefined && number > max)
  ) {
    throw new Error(`${label} must be a whole number${
      min !== undefined && max !== undefined ? ` from ${min} to ${max}` : ''
    }`)
  }
  return number
}

export function requiredInteger(
  value: unknown,
  label: string,
  bounds: { min?: number; max?: number } = {},
): number {
  const number = optionalInteger(value, label, bounds)
  if (number === null) throw new Error(`${label} is required`)
  return number
}

/** Validates a list of unique, positive row ids (e.g. a drag-and-drop order). */
export function parseIdList(value: unknown, label = 'Order'): number[] {
  if (
    !Array.isArray(value) ||
    value.some((id) => !Number.isSafeInteger(id) || id <= 0) ||
    new Set(value).size !== value.length
  ) {
    throw new Error(`${label} must be a list of unique ids`)
  }
  return value
}

export function isSlug(value: string): boolean {
  return patterns.slug.test(value)
}
