import { requiredText } from '@/lib/validation'
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
  location: unknown
  subtitleOne: unknown
  subtitleTwo: unknown
  logoUrl: unknown
}) {
  const { config } = await updateSectionConfig('hero', input)
  return config
}

export async function replaceTitles(titles: unknown) {
  if (!Array.isArray(titles)) throw new Error('Hero titles must be a list')
  const cleanTitles = titles.map((title) => requiredText(title, 'Hero title'))

  await runInTransaction(async (transaction) => {
    const sectionId = assertFound(
      await findSectionId('hero', transaction),
      'Page section "hero"',
    )
    await replaceHeroTitles(transaction, sectionId, cleanTitles)
  })
}
