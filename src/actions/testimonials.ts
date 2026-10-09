"use server";

import { requireAuth } from "@/lib/auth";
import { withAuthAction } from "@/server/action-result";
import {
  idListSchema,
  parseForm,
  parseInput,
  positiveId,
} from "@/server/schemas/common";
import { testimonialSchema } from "@/server/schemas/testimonials";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/testimonials";
export async function getTestimonials() {
  await requireAuth();
  return service.getTestimonials();
}
export async function createTestimonialItem(formData: FormData) {
  return withAuthAction(async () => {
    const item = await service.createTestimonial(
      parseForm(testimonialSchema, formData),
    );
    revalidateContent("/admin/testimonials");
    return item;
  })();
}
export async function updateTestimonialItem(id: number, formData: FormData) {
  return withAuthAction(async () => {
    const item = await service.updateTestimonial(
      parseInput(positiveId, id),
      parseForm(testimonialSchema, formData),
    );
    revalidateContent("/admin/testimonials");
    return item;
  })();
}
export async function deleteTestimonialItem(id: number) {
  return withAuthAction(async () => {
    await service.deleteTestimonial(parseInput(positiveId, id));
    revalidateContent("/admin/testimonials");
  })();
}
export async function reorderTestimonialItems(ids: number[]) {
  return withAuthAction(async () => {
    await service.reorderTestimonials(parseInput(idListSchema, ids));
    revalidateContent("/admin/testimonials");
  })();
}
