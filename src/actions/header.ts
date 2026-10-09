"use server";
import type { SectionKind } from "@/lib/db/constants";
import { requireAuth } from "@/lib/auth";
import { withAuthAction } from "@/server/action-result";
import { parseInput, sectionKindSchema } from "@/server/schemas/common";
import {
  presentationSchema,
  sectionOrderSchema,
  sectionToggleSchema,
} from "@/server/schemas/header";
import { revalidateContent } from "@/server/revalidate";
import * as service from "@/server/services/page-sections";
export async function getHeader() {
  await requireAuth();
  return service.listSections();
}
export async function updatePageSection(
  kind: SectionKind,
  values: { navigationTitle: string; title: string },
) {
  return withAuthAction(async () => {
    const validKind = parseInput(sectionKindSchema, kind);
    const section = await service.updatePresentation(
      validKind,
      parseInput(presentationSchema, values),
    );
    revalidateContent("/admin/header", `/admin/${validKind}`, "/");
    return section;
  })();
}
export async function togglePortfolioSection(
  kind: SectionKind,
  isEnabled: boolean,
) {
  return withAuthAction(async () => {
    const input = parseInput(sectionToggleSchema, { kind, isEnabled });
    await service.setSectionEnabled(input.kind, input.isEnabled);
    revalidateContent("/admin/header", `/admin/${kind}`, "/");
  })();
}
export async function reorderHeaderSections(kinds: SectionKind[]) {
  return withAuthAction(async () => {
    await service.reorderSections(parseInput(sectionOrderSchema, kinds));
    revalidateContent("/admin/header", "/");
  })();
}
