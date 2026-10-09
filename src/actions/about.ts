"use server";

import { requireAuth } from "@/lib/auth";
import { withAuthAction } from "@/server/action-result";
import {
  idListSchema,
  parseForm,
  parseInput,
  positiveId,
} from "@/server/schemas/common";
import { detailSchema, profileSchema } from "@/server/schemas/about";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/about";

export async function getAbout() {
  await requireAuth();
  return service.getAbout();
}
export async function updateAbout(formData: FormData) {
  return withAuthAction(async () => {
    const input = parseForm(profileSchema, formData);
    await service.saveProfile({
      name: input.name,
      jobTitle: input.jobTitle,
      biography: input.description,
    });
    revalidateContent("/admin/about", "/");
  })();
}
export async function createDetail(formData: FormData) {
  return withAuthAction(async () => {
    const detail = await service.createDetail(
      parseForm(detailSchema, formData),
    );
    revalidateContent("/admin/about");
    return detail;
  })();
}
export async function updateDetail(id: number, formData: FormData) {
  return withAuthAction(async () => {
    const detail = await service.updateDetail(
      parseInput(positiveId, id),
      parseForm(detailSchema, formData),
    );
    revalidateContent("/admin/about");
    return detail;
  })();
}
export async function deleteDetail(id: number) {
  return withAuthAction(async () => {
    await service.deleteDetail(parseInput(positiveId, id));
    revalidateContent("/admin/about");
  })();
}
export async function reorderDetails(ids: number[]) {
  return withAuthAction(async () => {
    await service.reorderDetails(parseInput(idListSchema, ids));
    revalidateContent("/admin/about");
  })();
}
