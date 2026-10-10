// Plain-value sanitizers for code that does not parse FormData; FormData goes through the Zod helpers in ./common.
import {
  ASSET_URL_PATTERN,
  LINK_URL_PATTERN,
  WEB_URL_PATTERN,
} from '@/shared/constants'

const patterns = {
  web: new RegExp(WEB_URL_PATTERN),
  asset: new RegExp(ASSET_URL_PATTERN),
  link: new RegExp(LINK_URL_PATTERN),
}

export type UrlKind = 'web' | 'asset' | 'link'

/** Trims a form value; empty or non-string input becomes null. */
export function optionalText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  return value.trim() || null
}

/** Trims a required form value and throws error when it is empty. */
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
