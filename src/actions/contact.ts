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
  contactMethodSchema,
  contactSettingsSchema,
} from "@/server/schemas/contact";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/contact";
function revalidateContactMethods() {
  revalidateContent(
    "/admin/contact",
    "/admin/about",
    "/api/contact",
    "/api/about",
    "/",
  );
}
export async function getContact() {
  await requireAuth();
  return service.getContact();
}
export async function updateContact(formData: FormData) {
  return withAuthAction(async () => {
    const data = await service.updateContactSettings(
      parseForm(contactSettingsSchema, formData),
    );
    revalidateContent("/admin/contact", "/api/contact");
    return data;
  })();
}
export async function createContactMethod(formData: FormData) {
  return withAuthAction(async () => {
    const method = await service.createContactMethod(
      parseForm(contactMethodSchema, formData),
    );
    revalidateContactMethods();
    return method;
  })();
}
export async function updateContactMethod(id: number, formData: FormData) {
  return withAuthAction(async () => {
    const method = await service.updateContactMethod(
      parseInput(positiveId, id),
      parseForm(contactMethodSchema, formData),
    );
    revalidateContactMethods();
    return method;
  })();
}
export async function deleteContactMethod(id: number) {
  return withAuthAction(async () => {
    await service.deleteContactMethod(parseInput(positiveId, id));
    revalidateContactMethods();
  })();
}
export async function reorderContactMethods(ids: number[]) {
  return withAuthAction(async () => {
    await service.reorderContactMethods(parseInput(idListSchema, ids));
    revalidateContactMethods();
  })();
}
