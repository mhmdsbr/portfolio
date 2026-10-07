import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { projectSlug } from "@/lib/project-slug";

export type ProjectWithDetails = schema.Project & {
  tech: string[];
  roles: string[];
};

export async function getProjects() {
  const [projects, technologyLinks, roleLinks] = await Promise.all([
    db
    .select()
    .from(schema.projects)
    .orderBy(asc(schema.projects.sortOrder)),
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
      .orderBy(asc(schema.projectTechnologies.sortOrder)),
    db
      .select({
        projectId: schema.projectRoles.projectId,
        role: schema.projectRoles.role,
        sortOrder: schema.projectRoles.sortOrder,
      })
      .from(schema.projectRoles)
      .orderBy(asc(schema.projectRoles.sortOrder)),
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

  return projects.map((project): ProjectWithDetails => ({
    ...project,
    tech: technologiesByProject.get(project.id) ?? [],
    roles: rolesByProject.get(project.id) ?? [],
  }));
}

export async function getProjectById(id: number) {
  const projects = await getProjects();
  return projects.find((project) => project.id === id);
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => projectSlug(project.title) === slug);
}

export async function getProjectsByCategory(category: string) {
  const projects = await getProjects();
  return projects.filter(
    (project) => projectSlug(project.category) === category,
  );
}
