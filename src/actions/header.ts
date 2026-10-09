'use server'

import type { SectionKind } from '@/lib/db/constants'
import { requireAuth } from '@/lib/auth'
import { revalidateContent } from '@/server/revalidate'
import * as service from '@/server/services/page-sections'

export async function getHeader() {
  await requireAuth()
  return service.listSections()
}

export async function updatePageSection(
  kind: SectionKind,
  values: { navigationTitle: string; title: string },
) {
  await requireAuth()
  const section = await service.updatePresentation(kind, values)
  revalidateContent('/admin/header', `/admin/${kind}`, '/')
  return section
}

export async function togglePortfolioSection(kind: SectionKind, isEnabled: boolean) {
  await requireAuth()
  await service.setSectionEnabled(kind, isEnabled)
  revalidateContent('/admin/header', `/admin/${kind}`, '/')
}

export async function reorderHeaderSections(kinds: SectionKind[]) {
  await requireAuth()
  await service.reorderSections(kinds)
  revalidateContent('/admin/header', '/')
}
