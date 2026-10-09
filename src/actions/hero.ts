"use server";
import { requireAuth } from "@/lib/auth";
import { withAuthAction } from "@/server/action-result";
import { parseForm, parseInput } from "@/server/schemas/common";
import { heroSchema, heroTitlesSchema } from "@/server/schemas/hero";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/hero";
export async function getHero() {
  await requireAuth();
  return service.getHero();
}
export async function updateHero(formData: FormData) {
  return withAuthAction(async () => {
    const config = await service.updateHeroSettings(
      parseForm(heroSchema, formData),
    );
    revalidateContent("/admin/hero");
    return config;
  })();
}
export async function updateHeroTitles(titles: string[]) {
  return withAuthAction(async () => {
    await service.replaceTitles(parseInput(heroTitlesSchema, titles));
    revalidateContent("/admin/hero");
  })();
}
