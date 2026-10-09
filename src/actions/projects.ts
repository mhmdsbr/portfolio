'use server'

import { requireAuth } from '@/lib/auth'
import {
  revalidateContent,
  revalidateProjectCategoryPages,
} from '@/server/revalidate'
import * as service from '@/server/services/projects'

const PAGE = '/admin/projects'

function readForm(formData: FormData) {
  return {
    title: formData.get('title'),
    category: formData.get('category'),
    description: formData.get('description'),
    image: formData.get('image'),
    link: formData.get('link'),
    githubUrl: formData.get('githubUrl'),
    roles: formData.get('roles'),
    tech: formData.get('tech'),
  }
}

export async function getProjects() {
  await requireAuth()
  return service.listProjects()
}

// Projects page data: the section settings, projects and existing categories
export async function getProjectsOverview() {
  await requireAuth()
  return service.getProjectsOverview()
}

// Existing category names for the category picker
export async function getProjectCategories() {
  await requireAuth()
  return service.listCategories()
}

export async function getProject(id: number) {
  await requireAuth()
  return service.getProject(id)
}

export async function createProject(formData: FormData) {
  await requireAuth()
  const project = await service.createProject(readForm(formData))
  revalidateContent(PAGE)
  return project
}

export async function updateProject(id: number, formData: FormData) {
  await requireAuth()
  const project = await service.updateProject(id, readForm(formData))
  revalidateContent(PAGE)
  return project
}

export async function deleteProject(id: number) {
  await requireAuth()
  await service.deleteProject(id)
  revalidateContent(PAGE)
}

export async function reorderProjects(ids: number[]) {
  await requireAuth()
  await service.reorderProjects(ids)
  revalidateContent(PAGE)
}

export async function updateProjectCategoriesAndTech(
  updates: { id: number; category: string; tech: string[] }[],
) {
  await requireAuth()
  await service.classifyProjects(updates)
  revalidateContent(PAGE, '/')
  revalidateProjectCategoryPages()
}
