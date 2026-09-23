import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { projectSlug } from "@/lib/project-slug";

export async function getProjects() {
  return db
    .select()
    .from(schema.projectItems)
    .orderBy(asc(schema.projectItems.sortOrder));
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
