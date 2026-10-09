import { YEAR_MAX, YEAR_MIN } from '@/lib/db/constants'
import { optionalInteger, optionalText, parseIdList, requiredText } from '@/lib/validation'
import { experienceRepo, skillRepo } from '@/server/repos/collections'
import { requireSection } from './page-sections'
import { assertFound } from './shared'

export interface ExperienceInput {
  fromYear: unknown
  toYear: unknown
  jobTitle: unknown
  company: unknown
  description: unknown
}

export interface SkillInput {
  skill: unknown
  level: unknown
}

function parseYears(input: Pick<ExperienceInput, 'fromYear' | 'toYear'>) {
  const fromYearText = optionalText(input.fromYear)
  const fromYear = fromYearText === null ? NaN : Number(fromYearText)
  if (!Number.isInteger(fromYear) || fromYear < YEAR_MIN || fromYear > YEAR_MAX) {
    throw new Error('Start year must be a valid year')
  }

  const toYearText = optionalText(input.toYear)
  const toYear =
    toYearText === null || toYearText.toLowerCase() === 'present'
      ? null
      : Number(toYearText)
  if (
    toYear !== null &&
    (!Number.isInteger(toYear) || toYear < fromYear || toYear > YEAR_MAX)
  ) {
    throw new Error('End year must be a valid year, not before the start year, or Present')
  }
  return { fromYear, toYear }
}

function parseExperience(input: ExperienceInput) {
  return {
    ...parseYears(input),
    jobTitle: requiredText(input.jobTitle, 'Job title'),
    company: requiredText(input.company, 'Company'),
    description: optionalText(input.description),
  }
}

function parseSkill(input: SkillInput) {
  return {
    skill: requiredText(input.skill, 'Skill'),
    level: optionalInteger(input.level, 'Skill level', { min: 0, max: 100 }),
  }
}

export async function getExperience() {
  const [{ section }, experiences, skills] = await Promise.all([
    requireSection('experience'),
    experienceRepo.list(),
    skillRepo.list(),
  ])
  return { section, experiences, skills }
}

export async function createExperience(input: ExperienceInput) {
  return experienceRepo.append(parseExperience(input))
}

export async function updateExperience(id: number, input: ExperienceInput) {
  return assertFound(
    await experienceRepo.update(id, parseExperience(input)),
    'Experience',
  )
}

export async function deleteExperience(id: number) {
  await experienceRepo.remove(id)
}

export async function reorderExperiences(ids: unknown) {
  return experienceRepo.reorder(parseIdList(ids))
}

export async function createSkill(input: SkillInput) {
  return skillRepo.append(parseSkill(input))
}

export async function updateSkill(id: number, input: SkillInput) {
  return assertFound(await skillRepo.update(id, parseSkill(input)), 'Skill')
}

export async function deleteSkill(id: number) {
  await skillRepo.remove(id)
}

export async function reorderSkills(ids: unknown) {
  return skillRepo.reorder(parseIdList(ids))
}
