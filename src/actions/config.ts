"use server";
import { requireAuth } from "@/lib/auth";
import { withAuthAction } from "@/server/action-result";
import { parseForm } from "@/server/schemas/common";
import { generalSettingsSchema } from "@/server/schemas/config";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/site-settings";
export async function getGeneralSettings() {
  await requireAuth();
  return service.getGeneralSettings();
}
export async function updateGeneralSettings(formData: FormData) {
  return withAuthAction(async () => {
    await service.saveGeneralSettings(
      parseForm(generalSettingsSchema, formData),
    );
    revalidateContent("/admin/general-settings", "/api/config");
  })();
}
