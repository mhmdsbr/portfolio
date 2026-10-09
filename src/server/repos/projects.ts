import { asc, eq, inArray, notExists, sql } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { uniqueSlug } from "@/lib/project-slug";
import { defaultExecutor, type DbExecutor } from "./executor";

export type ProjectWithDetails = schema.Project & {
  category: string;
  categorySlug: string;
  tech: string[];
  roles: string[];
};

export type ProjectFields = Omit<
  schema.NewProject,
  "id" | "slug" | "categoryId" | "sortOrder" | "createdAt" | "updatedAt"
>;

export async function getProjects(executor: DbExecutor = defaultExecutor) {
  const [projectRows, technologyLinks, roleLinks] = await Promise.all([
    executor
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
    executor
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
    executor
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

/** Category names (with project counts), alphabetically. */
export function listProjectCategories(executor: DbExecutor = defaultExecutor) {
  return executor
    .select({
      name: schema.projectCategories.name,
      projectCount: sql<number>`count(${schema.projects.id})::int`,
    })
    .from(schema.projectCategories)
    .leftJoin(
      schema.projects,
      eq(schema.projects.categoryId, schema.projectCategories.id),
    )
    .groupBy(schema.projectCategories.id, schema.projectCategories.name)
    .orderBy(asc(schema.projectCategories.name));
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

/** Inserts a project with a slug that is unique among existing projects. */
export async function insertProject(
  executor: DbExecutor,
  fields: ProjectFields,
  categoryId: number,
) {
  const taken = new Set(
    (
      await executor.select({ slug: schema.projects.slug }).from(schema.projects)
    ).map(({ slug }) => slug),
  );
  const [project] = await executor
    .insert(schema.projects)
    .values({
      ...fields,
      categoryId,
      slug: uniqueSlug(fields.title, taken, "project"),
    })
    .returning();
  return project;
}

/** Updates a project's category and, optionally, its fields. The slug never changes. */
export async function updateProjectRow(
  executor: DbExecutor,
  id: number,
  values: Partial<ProjectFields> & { categoryId: number },
) {
  const [project] = await executor
    .update(schema.projects)
    .set(values)
    .where(eq(schema.projects.id, id))
    .returning();
  return project;
}

export async function deleteProjectRow(executor: DbExecutor, id: number) {
  await executor.delete(schema.projects).where(eq(schema.projects.id, id));
}

export async function listProjectIds(executor: DbExecutor = defaultExecutor) {
  const rows = await executor
    .select({ id: schema.projects.id })
    .from(schema.projects);
  return rows.map(({ id }) => id);
}

export async function setProjectOrder(executor: DbExecutor, ids: number[]) {
  for (const [sortOrder, id] of ids.entries()) {
    await executor
      .update(schema.projects)
      .set({ sortOrder })
      .where(eq(schema.projects.id, id));
  }
}

export async function replaceProjectRoles(
  executor: DbExecutor,
  projectId: number,
  roles: string[],
) {
  await executor
    .delete(schema.projectRoles)
    .where(eq(schema.projectRoles.projectId, projectId));
  if (roles.length === 0) return;
  await executor
    .insert(schema.projectRoles)
    .values(roles.map((role, sortOrder) => ({ projectId, role, sortOrder })));
}

/** Replaces technology links for a project, creating missing technologies. */
export async function replaceProjectTechnologies(
  executor: DbExecutor,
  projectId: number,
  technologyNames: string[],
) {
  await executor
    .delete(schema.projectTechnologies)
    .where(eq(schema.projectTechnologies.projectId, projectId));
  if (technologyNames.length === 0) return;

  await executor
    .insert(schema.technologies)
    .values(technologyNames.map((name) => ({ name })))
    .onConflictDoNothing();

  const technologies = await executor
    .select({ id: schema.technologies.id, name: schema.technologies.name })
    .from(schema.technologies)
    .where(
      inArray(
        sql`lower(${schema.technologies.name})`,
        technologyNames.map((name) => name.toLocaleLowerCase()),
      ),
    );
  const technologyIds = new Map(
    technologies.map(({ id, name }) => [name.toLocaleLowerCase(), id]),
  );

  await executor.insert(schema.projectTechnologies).values(
    technologyNames.map((name, sortOrder) => {
      const technologyId = technologyIds.get(name.toLocaleLowerCase());
      if (technologyId === undefined) {
        throw new Error(`Unable to resolve project technology "${name}"`);
      }
      return { projectId, technologyId, sortOrder };
    }),
  );
}
