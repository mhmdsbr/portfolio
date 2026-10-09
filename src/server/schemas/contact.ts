import { z } from "zod";
import {
  contactMethodKindSchema,
  contactMethodSectionSchema,
  optionalText,
  optionalUrl,
  requiredText,
} from "./common";
export const contactSettingsSchema = z.object({
  formTitle: optionalText,
  buttonText: optionalText,
  buttonUrl: optionalUrl("Button URL"),
});
export const contactMethodSchema = z.object({
  kind: contactMethodKindSchema,
  title: requiredText("Contact method title"),
  value: requiredText("Contact method value"),
  sections: z.array(contactMethodSectionSchema),
});
