'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

// Get all projects
export async function getProjects() {
  await requireAuth()
  
  const projects = await db.select()
    .from(schema.projectItems)
    .orderBy(asc(schema.projectItems.sortOrder))
  
  return projects
}

// Get single project
export async function getProject(id: number) {
  await requireAuth()
  
  const [project] = await db.select()
    .from(schema.projectItems)
    .where(eq(schema.projectItems.id, id))
  
  return project
}

// Create project
export async function createProject(formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const roles = (formData.get('roles') as string)?.split('\n').map(role => role.trim()).filter(Boolean) || []
  const image = formData.get('image') as string
  const link = formData.get('link') as string
  const github = formData.get('github') as string
  const tech = (formData.get('tech') as string)?.split(',').map(t => t.trim()).filter(Boolean) || []
  
  // Get the projects section ID (there should be only one)
  const [section] = await db.select()
    .from(schema.projectsSection)
    .limit(1)
  const projectsSection = section ?? (await db.insert(schema.projectsSection).values({}).returning())[0]

  const [project] = await db.insert(schema.projectItems)
    .values({
      projectsId: projectsSection.id,
      title,
      category,
      description: description || null,
      roles: roles.length > 0 ? roles : null,
      image: image || null,
      link: link || null,
      github: github || null,
      tech: tech.length > 0 ? tech : null,
    })
    .returning()
  
  revalidatePath('/admin/projects')
  revalidatePath('/api/all')
  
  return project
}

// Update project
export async function updateProject(id: number, formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const roles = (formData.get('roles') as string)?.split('\n').map(role => role.trim()).filter(Boolean) || []
  const image = formData.get('image') as string
  const link = formData.get('link') as string
  const github = formData.get('github') as string
  const tech = (formData.get('tech') as string)?.split(',').map(t => t.trim()).filter(Boolean) || []
  
  const [project] = await db.update(schema.projectItems)
    .set({
      title,
      category,
      description: description || null,
      roles: roles.length > 0 ? roles : null,
      image: image || null,
      link: link || null,
      github: github || null,
      tech: tech.length > 0 ? tech : null,
    })
    .where(eq(schema.projectItems.id, id))
    .returning()
  
  revalidatePath('/admin/projects')
  revalidatePath('/api/all')
  
  return project
}

// Delete project
export async function deleteProject(id: number) {
  await requireAuth()
  
  await db.delete(schema.projectItems)
    .where(eq(schema.projectItems.id, id))
  
  revalidatePath('/admin/projects')
  revalidatePath('/api/all')
}

// Update sort order
export async function reorderProjects(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) => 
      db.update(schema.projectItems)
        .set({ sortOrder: index })
        .where(eq(schema.projectItems.id, id))
    )
  )
  
  revalidatePath('/admin/projects')
  revalidatePath('/api/all')
}