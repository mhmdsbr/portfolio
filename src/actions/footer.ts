"use server";
import { requireAuth } from "@/lib/auth";
import { withAuthAction } from "@/server/action-result";
import { parseForm } from "@/server/schemas/common";
import { footerSchema } from "@/server/schemas/footer";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/site-settings";
export async function getFooter() {
  await requireAuth();
  return service.getFooter();
}
export async function updateFooter(formData: FormData) {
  return withAuthAction(async () => {
    const data = await service.saveFooter(parseForm(footerSchema, formData));
    revalidateContent("/admin/footer");
    return data;
  })();
}
