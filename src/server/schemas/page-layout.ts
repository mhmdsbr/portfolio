import { z } from "zod";
import { checkboxBoolean, sectionKindSchema, requiredText } from "./common";
export const sectionPresentationSchema = z.object({
  navigationTitle: requiredText("Navigation title"),
  title: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() || null : null),
    z.string().nullable(),
  ),
});
export const sectionVisibilitySchema = z.object({
  kind: sectionKindSchema,
  isEnabled: checkboxBoolean,
});
export const pageLayoutOrderSchema = z
  .array(sectionKindSchema)
  .min(1)
  .refine(
    (kinds) => new Set(kinds).size === kinds.length,
    "Invalid portfolio section order",
  );
