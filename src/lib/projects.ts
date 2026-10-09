import { asc, eq, notExists, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import type { DbExecutor } from "@/lib/db/sections";
import { uniqueSlug } from "@/lib/project-slug";

export type ProjectWithDetails = schema.Project & {
  category: string;
  categorySlug: string;
  tech: string[];
  roles: string[];
};

export async function getProjects() {
  const [projectRows, technologyLinks, roleLinks] = await Promise.all([
    db
      .select({
        project: schema.projects,
        category: schema.projectCategories.name,
        categorySlug: schema.projectCategories.slug,
      })
      .from(schema.projects)
      .innerJoin(
        schema.projectCategories,
        eq(schema.projectCategories.id, schema.projects.categoryId),
      )
      .orderBy(asc(schema.projects.sortOrder), asc(schema.projects.id)),
    db
      .select({
        projectId: schema.projectTechnologies.projectId,
        name: schema.technologies.name,
        sortOrder: schema.projectTechnologies.sortOrder,
      })
      .from(schema.projectTechnologies)
      .innerJoin(
        schema.technologies,
        eq(schema.technologies.id, schema.projectTechnologies.technologyId),
      )
      .orderBy(
        asc(schema.projectTechnologies.sortOrder),
        asc(schema.projectTechnologies.projectId),
        asc(schema.projectTechnologies.technologyId),
      ),
    db
      .select({
        projectId: schema.projectRoles.projectId,
        role: schema.projectRoles.role,
        sortOrder: schema.projectRoles.sortOrder,
      })
      .from(schema.projectRoles)
      .orderBy(
        asc(schema.projectRoles.sortOrder),
        asc(schema.projectRoles.projectId),
        asc(schema.projectRoles.role),
      ),
  ]);

  const technologiesByProject = new Map<number, string[]>();
  for (const link of technologyLinks) {
    const values = technologiesByProject.get(link.projectId) ?? [];
    values.push(link.name);
    technologiesByProject.set(link.projectId, values);
  }

  const rolesByProject = new Map<number, string[]>();
  for (const link of roleLinks) {
    const values = rolesByProject.get(link.projectId) ?? [];
    values.push(link.role);
    rolesByProject.set(link.projectId, values);
  }

  return projectRows.map(
    ({ project, category, categorySlug }): ProjectWithDetails => ({
      ...project,
      category,
      categorySlug,
      tech: technologiesByProject.get(project.id) ?? [],
      roles: rolesByProject.get(project.id) ?? [],
    }),
  );
}

export async function getProjectById(id: number) {
  const projects = await getProjects();
  return projects.find((project) => project.id === id);
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getProjectsByCategory(categorySlug: string) {
  const projects = await getProjects();
  return projects.filter((project) => project.categorySlug === categorySlug);
}

/** Returns the id of the category with this name (case-insensitive), creating it if needed. */
export async function findOrCreateCategory(
  executor: DbExecutor,
  rawName: string,
): Promise<number> {
  const name = rawName.trim();
  if (!name) throw new Error("Project category is required");

  const [existing] = await executor
    .select({ id: schema.projectCategories.id })
    .from(schema.projectCategories)
    .where(sql`lower(${schema.projectCategories.name}) = lower(${name})`)
    .limit(1);
  if (existing) return existing.id;

  const taken = new Set(
    (
      await executor
        .select({ slug: schema.projectCategories.slug })
        .from(schema.projectCategories)
    ).map(({ slug }) => slug),
  );
  const [created] = await executor
    .insert(schema.projectCategories)
    .values({ name, slug: uniqueSlug(name, taken, "category") })
    .returning({ id: schema.projectCategories.id });
  return created.id;
}

/** Generates a project slug that is unique among existing projects. */
export async function createProjectSlug(executor: DbExecutor, title: string) {
  const taken = new Set(
    (
      await executor
        .select({ slug: schema.projects.slug })
        .from(schema.projects)
    ).map(({ slug }) => slug),
  );
  return uniqueSlug(title, taken, "project");
}

/** Removes categories that no project references any more. */
export async function pruneEmptyCategories(executor: DbExecutor) {
  await executor.delete(schema.projectCategories).where(
    notExists(
      executor
        .select({ one: sql`1` })
        .from(schema.projects)
        .where(eq(schema.projects.categoryId, schema.projectCategories.id)),
    ),
  );
}
