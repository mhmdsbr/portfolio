import { db } from '@/lib/db'
import { pageSections } from '@/lib/db/schema'
import { PORTFOLIO_SECTIONS } from '@/lib/portfolio-sections'
import { desc } from 'drizzle-orm'

export async function ensurePortfolioSections() {
  const existingSections = await db
    .select({ sectionKey: pageSections.sectionKey })
    .from(pageSections)
  const existingKeys = new Set(existingSections.map(({ sectionKey }) => sectionKey))
  const missingSections = PORTFOLIO_SECTIONS.filter(({ key }) => !existingKeys.has(key))

  if (missingSections.length === 0) return

  const [lastSection] = await db
    .select({ sortOrder: pageSections.sortOrder })
    .from(pageSections)
    .orderBy(desc(pageSections.sortOrder))
    .limit(1)
  const nextSortOrder = (lastSection?.sortOrder ?? -1) + 1

  await db
    .insert(pageSections)
    .values(missingSections.map((section, index) => ({
      sectionKey: section.key,
      navigationTitle: section.navigationTitle,
      title: section.title,
      overlayTitle: section.overlayTitle,
      sortOrder: nextSortOrder + index,
      isEnabled: true,
    })))
    .onConflictDoNothing()
}
