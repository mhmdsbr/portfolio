"use server";
import { requireAuth } from "@/lib/auth";
import { withAuthAction } from "@/server/action-result";
import {
  idListSchema,
  parseForm,
  parseInput,
  positiveId,
} from "@/server/schemas/common";
import { experienceSchema, skillSchema } from "@/server/schemas/experience";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/experience";
const PAGE = "/admin/experience";
export async function getExperience() {
  await requireAuth();
  return service.getExperience();
}
export async function createExperience(formData: FormData) {
  return withAuthAction(async () => {
    const row = await service.createExperience(
      parseForm(experienceSchema, formData),
    );
    revalidateContent(PAGE);
    return row;
  })();
}
export async function updateExperience(id: number, formData: FormData) {
  return withAuthAction(async () => {
    const row = await service.updateExperience(
      parseInput(positiveId, id),
      parseForm(experienceSchema, formData),
    );
    revalidateContent(PAGE);
    return row;
  })();
}
export async function deleteExperience(id: number) {
  return withAuthAction(async () => {
    await service.deleteExperience(parseInput(positiveId, id));
    revalidateContent(PAGE);
  })();
}
export async function reorderExperiences(ids: number[]) {
  return withAuthAction(async () => {
    await service.reorderExperiences(parseInput(idListSchema, ids));
    revalidateContent(PAGE);
  })();
}
export async function createSkill(formData: FormData) {
  return withAuthAction(async () => {
    const row = await service.createSkill(parseForm(skillSchema, formData));
    revalidateContent(PAGE);
    return row;
  })();
}
export async function updateSkill(id: number, formData: FormData) {
  return withAuthAction(async () => {
    const row = await service.updateSkill(
      parseInput(positiveId, id),
      parseForm(skillSchema, formData),
    );
    revalidateContent(PAGE);
    return row;
  })();
}
export async function deleteSkill(id: number) {
  return withAuthAction(async () => {
    await service.deleteSkill(parseInput(positiveId, id));
    revalidateContent(PAGE);
  })();
}
export async function reorderSkills(ids: number[]) {
  return withAuthAction(async () => {
    await service.reorderSkills(parseInput(idListSchema, ids));
    revalidateContent(PAGE);
  })();
}
