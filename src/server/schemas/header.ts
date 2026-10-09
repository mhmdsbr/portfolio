import { z } from "zod";
import { checkboxBoolean, sectionKindSchema, requiredText } from "./common";
export const presentationSchema = z.object({
  navigationTitle: requiredText("Navigation title"),
  title: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() || null : null),
    z.string().nullable(),
  ),
});
export const sectionToggleSchema = z.object({
  kind: sectionKindSchema,
  isEnabled: checkboxBoolean,
});
export const sectionOrderSchema = z
  .array(sectionKindSchema)
  .min(1)
  .refine(
    (kinds) => new Set(kinds).size === kinds.length,
    "Invalid portfolio section order",
  );
