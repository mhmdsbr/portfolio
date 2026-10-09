
import { runInTransaction } from '@/server/repos/executor'
import * as projects from '@/server/repos/projects'
import { requireSection } from './page-sections'
import { assertFound, ValidationError } from './shared'

export interface ProjectInput {
  title: string
  category: string
  description: string | null
  image: string | null
  link: string | null
  githubUrl: string | null
  roles: string[]
  tech: string[]
}

export interface ProjectClassification {
  id: number
  category: string
  tech: string[]
}

function normalizeTechnologies(values: string[]) {
  return [...new Map(values.map((item) => item.trim()).filter(Boolean).map((name) => [name.toLocaleLowerCase(), name])).values()]
}

export async function listProjects() {
  return projects.getProjects()
}

export async function getProject(id: number) {
  return projects.getProjectById(id)
}

export async function listCategories() {
  return projects.listProjectCategories()
}

export async function getProjectsOverview() {
  const [{ section }, allProjects, categories] = await Promise.all([
    requireSection('projects'),
    projects.getProjects(),
    projects.listProjectCategories(),
  ])
  return { section, projects: allProjects, categories }
}

export async function createProject(input: ProjectInput) {
  const { category, title, description, image, link, githubUrl, roles, tech } = input
  const fields = { title, description, image, link, githubUrl }

  return runInTransaction(async (transaction) => {
    const categoryId = await projects.findOrCreateCategory(transaction, category)
    const created = await projects.insertProject(transaction, fields, categoryId)
    await projects.replaceProjectRoles(transaction, created.id, roles)
    await projects.replaceProjectTechnologies(transaction, created.id, tech)
    return created
  })
}

export async function updateProject(id: number, input: ProjectInput) {
  const { category, title, description, image, link, githubUrl, roles, tech } = input
  const fields = { title, description, image, link, githubUrl }

  return runInTransaction(async (transaction) => {
    const categoryId = await projects.findOrCreateCategory(transaction, category)
    const updated = assertFound(
      await projects.updateProjectRow(transaction, id, { ...fields, categoryId }),
      `Project ${id}`,
    )
    await projects.replaceProjectRoles(transaction, id, roles)
    await projects.replaceProjectTechnologies(transaction, id, tech)
    await projects.pruneEmptyCategories(transaction)
    return updated
  })
}

export async function deleteProject(id: number) {
  await runInTransaction(async (transaction) => {
    await projects.deleteProjectRow(transaction, id)
    await projects.pruneEmptyCategories(transaction)
  })
}

export async function reorderProjects(ids: number[]) {
  const order = ids
  await runInTransaction(async (transaction) => {
    const existing = new Set(await projects.listProjectIds(transaction))
    if (order.some((id) => !existing.has(id))) {
      throw new ValidationError('Order contains items that do not exist')
    }
    await projects.setProjectOrder(transaction, order)
  })
}

/** Bulk-edits category and technologies of several projects in one transaction. */
export async function classifyProjects(updates: ProjectClassification[]) {
  if (
    !Array.isArray(updates) ||
    updates.length === 0 ||
    updates.some(
      ({ id, category, tech }) =>
        !Number.isSafeInteger(id) ||
        id <= 0 ||
        typeof category !== 'string' ||
        !category.trim() ||
        !Array.isArray(tech) ||
        tech.some((item) => typeof item !== 'string' || !item.trim()),
    ) ||
    new Set(updates.map(({ id }) => id)).size !== updates.length
  ) {
    throw new ValidationError('Invalid project category or technology updates')
  }

  await runInTransaction(async (transaction) => {
    for (const { id, category, tech } of updates) {
      const categoryId = await projects.findOrCreateCategory(transaction, category)
      assertFound(
        await projects.updateProjectRow(transaction, id, { categoryId }),
        `Project ${id}`,
      )
      await projects.replaceProjectTechnologies(
        transaction,
        id,
        normalizeTechnologies(tech),
      )
    }
    await projects.pruneEmptyCategories(transaction)
  })
}
