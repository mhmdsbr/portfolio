"use server";
import { requireAuth } from "@/lib/auth";
import { withAuthAction } from "@/server/action-result";
import {
  idListSchema,
  parseForm,
  parseInput,
  positiveId,
} from "@/server/schemas/common";
import { serviceItemSchema } from "@/server/schemas/services";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/service-items";
export async function getServices() {
  await requireAuth();
  return service.getServices();
}
export async function createServiceItem(formData: FormData) {
  return withAuthAction(async () => {
    const item = await service.createServiceItem(
      parseForm(serviceItemSchema, formData),
    );
    revalidateContent("/admin/services");
    return item;
  })();
}
export async function updateServiceItem(id: number, formData: FormData) {
  return withAuthAction(async () => {
    const item = await service.updateServiceItem(
      parseInput(positiveId, id),
      parseForm(serviceItemSchema, formData),
    );
    revalidateContent("/admin/services");
    return item;
  })();
}
export async function deleteServiceItem(id: number) {
  return withAuthAction(async () => {
    await service.deleteServiceItem(parseInput(positiveId, id));
    revalidateContent("/admin/services");
  })();
}
export async function reorderServiceItems(ids: number[]) {
  return withAuthAction(async () => {
    await service.reorderServiceItems(parseInput(idListSchema, ids));
    revalidateContent("/admin/services");
  })();
}
