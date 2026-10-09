import { runInTransaction } from '@/server/repos/executor'
import { listHeroTitles, replaceHeroTitles } from '@/server/repos/hero-titles'
import { findSectionId } from '@/server/repos/page-sections'
import { requireSection, updateSectionConfig } from './page-sections'
import { assertFound } from './shared'

export async function getHero() {
  const { section, config } = await requireSection('hero')
  const titles = await listHeroTitles(section.id)
  return { section, config, titles: titles.map(({ title }) => title) }
}

export async function updateHeroSettings(input: {
  location: string | null
  subtitleOne: string | null
  subtitleTwo: string | null
  logoUrl: string | null
}) {
  const { config } = await updateSectionConfig('hero', input)
  return config
}

export async function replaceTitles(titles: string[]) {
  const cleanTitles = titles

  await runInTransaction(async (transaction) => {
    const sectionId = assertFound(
      await findSectionId('hero', transaction),
      'Page section "hero"',
    )
    await replaceHeroTitles(transaction, sectionId, cleanTitles)
  })
}
