"use server";
import type { SectionKind } from "@/shared/types";
import { requireAuth } from "@/server/auth/session";
import { withAuthAction } from "@/server/action-result";
import { parseInput, sectionKindSchema } from "@/server/schemas/common";
import {
  pageLayoutOrderSchema,
  sectionPresentationSchema,
  sectionVisibilitySchema,
} from "@/server/schemas/page-layout";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/page-sections";
export async function getPageLayout() {
  await requireAuth();
  return service.listSections();
}
export async function updateSectionPresentation(
  kind: SectionKind,
  values: { navigationTitle: string; title: string },
) {
  return withAuthAction(async () => {
    const validKind = parseInput(sectionKindSchema, kind);
    const section = await service.updatePresentation(
      validKind,
      parseInput(sectionPresentationSchema, values),
    );
    revalidateContent("/admin/page-layout", `/admin/${validKind}`, "/");
    return section;
  })();
}
export async function setSectionVisibility(
  kind: SectionKind,
  isEnabled: boolean,
) {
  return withAuthAction(async () => {
    const input = parseInput(sectionVisibilitySchema, { kind, isEnabled });
    await service.setSectionEnabled(input.kind, input.isEnabled);
    revalidateContent("/admin/page-layout", `/admin/${kind}`, "/");
  })();
}
export async function reorderPageLayoutSections(kinds: SectionKind[]) {
  return withAuthAction(async () => {
    await service.reorderPageLayoutSections(
      parseInput(pageLayoutOrderSchema, kinds),
    );
    revalidateContent("/admin/page-layout", "/");
  })();
}
