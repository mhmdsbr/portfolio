
import { experienceRepo, skillRepo } from '@/server/repos/collections'
import { requireSection } from './page-sections'
import { assertFound } from './shared'

export interface ExperienceInput {
  fromYear: number
  toYear: number | null
  jobTitle: string
  company: string
  description: string | null
}

export interface SkillInput {
  skill: string
  level: number | null
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
  return experienceRepo.append(input)
}

export async function updateExperience(id: number, input: ExperienceInput) {
  return assertFound(
    await experienceRepo.update(id, input),
    'Experience',
  )
}

export async function deleteExperience(id: number) {
  await experienceRepo.remove(id)
}

export async function reorderExperiences(ids: number[]) {
  return experienceRepo.reorder(ids)
}

export async function createSkill(input: SkillInput) {
  return skillRepo.append(input)
}

export async function updateSkill(id: number, input: SkillInput) {
  return assertFound(await skillRepo.update(id, input), 'Skill')
}

export async function deleteSkill(id: number) {
  await skillRepo.remove(id)
}

export async function reorderSkills(ids: number[]) {
  return skillRepo.reorder(ids)
}
