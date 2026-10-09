import { z } from "zod";
import { optionalText, requiredText, serviceIconSchema } from "./common";
export const serviceItemSchema = z.object({
  title: requiredText("Service title"),
  description: optionalText,
  icon: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() || null : null),
    serviceIconSchema,
  ),
});
