'use server'

import { requireAuth } from '@/lib/auth'
import { revalidateContent } from '@/server/revalidate'
import * as service from '@/server/services/experience'

function readExperience(formData: FormData) {
  return {
    fromYear: formData.get('fromYear'),
    toYear: formData.get('toYear'),
    jobTitle: formData.get('jobTitle'),
    company: formData.get('company'),
    description: formData.get('description'),
  }
}

function readSkill(formData: FormData) {
  return { skill: formData.get('skill'), level: formData.get('level') }
}

const PAGE = '/admin/experience'

export async function getExperience() {
  await requireAuth()
  return service.getExperience()
}

export async function createExperience(formData: FormData) {
  await requireAuth()
  const experience = await service.createExperience(readExperience(formData))
  revalidateContent(PAGE)
  return experience
}

export async function updateExperience(id: number, formData: FormData) {
  await requireAuth()
  const experience = await service.updateExperience(id, readExperience(formData))
  revalidateContent(PAGE)
  return experience
}

export async function deleteExperience(id: number) {
  await requireAuth()
  await service.deleteExperience(id)
  revalidateContent(PAGE)
}

export async function reorderExperiences(ids: number[]) {
  await requireAuth()
  await service.reorderExperiences(ids)
  revalidateContent(PAGE)
}

export async function createSkill(formData: FormData) {
  await requireAuth()
  const skill = await service.createSkill(readSkill(formData))
  revalidateContent(PAGE)
  return skill
}

export async function updateSkill(id: number, formData: FormData) {
  await requireAuth()
  const skill = await service.updateSkill(id, readSkill(formData))
  revalidateContent(PAGE)
  return skill
}

export async function deleteSkill(id: number) {
  await requireAuth()
  await service.deleteSkill(id)
  revalidateContent(PAGE)
}

export async function reorderSkills(ids: number[]) {
  await requireAuth()
  await service.reorderSkills(ids)
  revalidateContent(PAGE)
}
