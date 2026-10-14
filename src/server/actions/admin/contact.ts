"use server";
import { requireAuth } from "@/server/auth/session";
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
  socialLinkSchema,
} from "@/server/schemas/contact";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/contact";
function revalidateContactContent() {
  revalidateContent(
    "/admin/contact",
    "/admin/about",
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
    revalidateContent("/admin/contact");
    return data;
  })();
}
export async function createContactMethod(formData: FormData) {
  return withAuthAction(async () => {
    const method = await service.createContactMethod(
      parseForm(contactMethodSchema, formData),
    );
    revalidateContactContent();
    return method;
  })();
}
export async function updateContactMethod(id: number, formData: FormData) {
  return withAuthAction(async () => {
    const method = await service.updateContactMethod(
      parseInput(positiveId, id),
      parseForm(contactMethodSchema, formData),
    );
    revalidateContactContent();
    return method;
  })();
}
export async function deleteContactMethod(id: number) {
  return withAuthAction(async () => {
    await service.deleteContactMethod(parseInput(positiveId, id));
    revalidateContactContent();
  })();
}
export async function reorderContactMethods(ids: number[]) {
  return withAuthAction(async () => {
    await service.reorderContactMethods(parseInput(idListSchema, ids));
    revalidateContactContent();
  })();
}
export async function createSocialLink(formData: FormData) {
  return withAuthAction(async () => {
    const socialLink = await service.createSocialLink(
      parseForm(socialLinkSchema, formData),
    );
    revalidateContactContent();
    return socialLink;
  })();
}
export async function updateSocialLink(id: number, formData: FormData) {
  return withAuthAction(async () => {
    const socialLink = await service.updateSocialLink(
      parseInput(positiveId, id),
      parseForm(socialLinkSchema, formData),
    );
    revalidateContactContent();
    return socialLink;
  })();
}
export async function deleteSocialLink(id: number) {
  return withAuthAction(async () => {
    await service.deleteSocialLink(parseInput(positiveId, id));
    revalidateContactContent();
  })();
}
export async function reorderSocialLinks(ids: number[]) {
  return withAuthAction(async () => {
    await service.reorderSocialLinks(parseInput(idListSchema, ids));
    revalidateContactContent();
  })();
}
