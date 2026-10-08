'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { getProjectById, getProjects as getProjectsWithDetails } from '@/lib/projects'

type ProjectTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

function parseLines(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return []
  return [...new Set(value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean))]
}

function parseTechnologies(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return []
  return normalizeTechnologies(value.split(','))
}

function normalizeTechnologies(values: string[]) {
  return [...new Map(
    values.map((item) => item.trim()).filter(Boolean)
      .map((name) => [name.toLocaleLowerCase(), name]),
  ).values()]
}

async function replaceProjectDetails(
  transaction: ProjectTransaction,
  projectId: number,
  roles: string[] | null,
  technologyNames: string[],
) {
  if (roles !== null) {
    await transaction.delete(schema.projectRoles)
      .where(eq(schema.projectRoles.projectId, projectId))
    if (roles.length > 0) {
      await transaction.insert(schema.projectRoles).values(
        roles.map((role, sortOrder) => ({ projectId, role, sortOrder })),
      )
    }
  }

  await transaction.delete(schema.projectTechnologies)
    .where(eq(schema.projectTechnologies.projectId, projectId))

  if (technologyNames.length === 0) return

  await transaction.insert(schema.technologies)
    .values(technologyNames.map((name) => ({ name })))
    .onConflictDoNothing()

  const technologies = await transaction.select({
    id: schema.technologies.id,
    name: schema.technologies.name,
  }).from(schema.technologies)
    .where(sql`lower(${schema.technologies.name}) IN ${sql.join(
      technologyNames.map((name) => sql`${name.toLocaleLowerCase()}`),
      sql`, `,
    )}`)
  const technologyIds = new Map(
    technologies.map(({ id, name }) => [name.toLocaleLowerCase(), id]),
  )

  await transaction.insert(schema.projectTechnologies).values(
    technologyNames.map((name, sortOrder) => {
      const technologyId = technologyIds.get(name.toLocaleLowerCase())
      if (technologyId === undefined) {
        throw new Error(`Unable to resolve project technology "${name}"`)
      }
      return { projectId, technologyId, sortOrder }
    }),
  )
}

// Get all projects
export async function getProjects() {
  await requireAuth()
  return getProjectsWithDetails()
}

// Get single project
export async function getProject(id: number) {
  await requireAuth()
  return getProjectById(id)
}

// Create project
export async function createProject(formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const roles = parseLines(formData.get('roles'))
  const image = formData.get('image') as string
  const link = formData.get('link') as string
  const githubUrl = formData.get('githubUrl') as string
  const tech = parseTechnologies(formData.get('tech'))

  const project = await db.transaction(async (transaction) => {
    const [createdProject] = await transaction.insert(schema.projects)
      .values({
        title,
        category,
        description: description || null,
        image: image || null,
        link: link || null,
        githubUrl: githubUrl || null,
      })
      .returning()

    await replaceProjectDetails(transaction, createdProject.id, roles, tech)
    return createdProject
  })
  
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
  const roles = parseLines(formData.get('roles'))
  const image = formData.get('image') as string
  const link = formData.get('link') as string
  const githubUrl = formData.get('githubUrl') as string
  const tech = parseTechnologies(formData.get('tech'))

  const project = await db.transaction(async (transaction) => {
    const [updatedProject] = await transaction.update(schema.projects)
      .set({
        title,
        category,
        description: description || null,
        image: image || null,
        link: link || null,
        githubUrl: githubUrl || null,
      })
      .where(eq(schema.projects.id, id))
      .returning()

    if (!updatedProject) {
      throw new Error(`Project ${id} was not found`)
    }
    await replaceProjectDetails(transaction, id, roles, tech)
    return updatedProject
  })
  
  revalidatePath('/admin/projects')
  revalidatePath('/api/all')
  
  return project
}

// Delete project
export async function deleteProject(id: number) {
  await requireAuth()
  
  await db.delete(schema.projects)
    .where(eq(schema.projects.id, id))
  
  revalidatePath('/admin/projects')
  revalidatePath('/api/all')
}

// Update sort order
export async function reorderProjects(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) => 
      db.update(schema.projects)
        .set({ sortOrder: index })
        .where(eq(schema.projects.id, id))
    )
  )
  
  revalidatePath('/admin/projects')
  revalidatePath('/api/all')
}

export async function updateProjectCategoriesAndTech(
  updates: { id: number; category: string; tech: string[] }[],
) {
  await requireAuth()

  if (
    updates.length === 0 ||
    updates.some(
      ({ id, category, tech }) =>
        !Number.isSafeInteger(id) ||
        id <= 0 ||
        !category.trim() ||
        !Array.isArray(tech) ||
        tech.some((item) => typeof item !== 'string' || !item.trim()),
    ) ||
    new Set(updates.map(({ id }) => id)).size !== updates.length
  ) {
    throw new Error('Invalid project category or technology updates')
  }

  await db.transaction(async (transaction) => {
    for (const { id, category, tech } of updates) {
      const [updatedProject] = await transaction
        .update(schema.projects)
        .set({
          category: category.trim(),
        })
        .where(eq(schema.projects.id, id))
        .returning({ id: schema.projects.id })

      if (!updatedProject) {
        throw new Error(`Project ${id} was not found`)
      }

      const normalizedTech = normalizeTechnologies(tech)
      await replaceProjectDetails(transaction, id, null, normalizedTech)
    }
  })

  revalidatePath('/admin/projects')
  revalidatePath('/')
  revalidatePath('/projects/category/[slug]', 'page')
  revalidatePath('/api/all')
}