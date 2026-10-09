import { optionalText, optionalUrl, parseIdList, requiredText } from '@/lib/validation'
import { runInTransaction } from '@/server/repos/executor'
import * as projects from '@/server/repos/projects'
import { requireSection } from './page-sections'
import { assertFound } from './shared'

export interface ProjectInput {
  title: unknown
  category: unknown
  description: unknown
  image: unknown
  link: unknown
  githubUrl: unknown
  /** One role per line. */
  roles: unknown
  /** Comma-separated technology names. */
  tech: unknown
}

export interface ProjectClassification {
  id: number
  category: string
  tech: string[]
}

function parseLines(value: unknown) {
  if (typeof value !== 'string') return []
  return [...new Set(value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean))]
}

function normalizeTechnologies(values: string[]) {
  return [
    ...new Map(
      values
        .map((item) => item.trim())
        .filter(Boolean)
        .map((name) => [name.toLocaleLowerCase(), name]),
    ).values(),
  ]
}

function parseProject(input: ProjectInput) {
  return {
    category: requiredText(input.category, 'Project category'),
    fields: {
      title: requiredText(input.title, 'Project title'),
      description: optionalText(input.description),
      image: optionalUrl(input.image, 'Image', 'asset'),
      link: optionalUrl(input.link, 'Link', 'web'),
      githubUrl: optionalUrl(input.githubUrl, 'GitHub URL', 'web'),
    },
    roles: parseLines(input.roles),
    tech: normalizeTechnologies(
      typeof input.tech === 'string' ? input.tech.split(',') : [],
    ),
  }
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
  const { category, fields, roles, tech } = parseProject(input)

  return runInTransaction(async (transaction) => {
    const categoryId = await projects.findOrCreateCategory(transaction, category)
    const created = await projects.insertProject(transaction, fields, categoryId)
    await projects.replaceProjectRoles(transaction, created.id, roles)
    await projects.replaceProjectTechnologies(transaction, created.id, tech)
    return created
  })
}

export async function updateProject(id: number, input: ProjectInput) {
  const { category, fields, roles, tech } = parseProject(input)

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

export async function reorderProjects(ids: unknown) {
  const order = parseIdList(ids)
  await runInTransaction(async (transaction) => {
    const existing = new Set(await projects.listProjectIds(transaction))
    if (order.some((id) => !existing.has(id))) {
      throw new Error('Order contains items that do not exist')
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
    throw new Error('Invalid project category or technology updates')
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
