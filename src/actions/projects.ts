"use server";
import { requireAuth } from "@/lib/auth";
import { withAuthAction } from "@/server/action-result";
import {
  idListSchema,
  parseForm,
  parseInput,
  positiveId,
} from "@/server/schemas/common";
import {
  projectClassificationsSchema,
  projectSchema,
} from "@/server/schemas/projects";
import {
  revalidateContent,
  revalidateProjectCategoryPages,
} from "@/server/revalidate";
import * as service from "@/server/services/projects";
const PAGE = "/admin/projects";
export async function getProjects() {
  await requireAuth();
  return service.listProjects();
}
export async function getProjectsOverview() {
  await requireAuth();
  return service.getProjectsOverview();
}
export async function getProjectCategories() {
  await requireAuth();
  return service.listCategories();
}
export async function getProject(id: number) {
  await requireAuth();
  return service.getProject(id);
}
export async function createProject(formData: FormData) {
  return withAuthAction(async () => {
    const project = await service.createProject(
      parseForm(projectSchema, formData),
    );
    revalidateContent(PAGE);
    return project;
  })();
}
export async function updateProject(id: number, formData: FormData) {
  return withAuthAction(async () => {
    const project = await service.updateProject(
      parseInput(positiveId, id),
      parseForm(projectSchema, formData),
    );
    revalidateContent(PAGE);
    return project;
  })();
}
export async function deleteProject(id: number) {
  return withAuthAction(async () => {
    await service.deleteProject(parseInput(positiveId, id));
    revalidateContent(PAGE);
  })();
}
export async function reorderProjects(ids: number[]) {
  return withAuthAction(async () => {
    await service.reorderProjects(parseInput(idListSchema, ids));
    revalidateContent(PAGE);
  })();
}
export async function updateProjectCategoriesAndTech(
  updates: { id: number; category: string; tech: string[] }[],
) {
  return withAuthAction(async () => {
    await service.classifyProjects(
      parseInput(projectClassificationsSchema, updates),
    );
    revalidateContent(PAGE, "/");
    revalidateProjectCategoryPages();
  })();
}
