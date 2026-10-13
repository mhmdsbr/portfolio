import { z } from "zod";
import {
  contactMethodKindSchema,
  contactMethodSectionSchema,
  optionalText,
  optionalUrl,
  requiredText,
  socialPlatformSchema,
} from "./common";
import { LINK_URL_PATTERN } from "@/shared/constants";
export const contactSettingsSchema = z.object({
  formTitle: optionalText,
  buttonText: optionalText,
  buttonUrl: optionalUrl("Button URL"),
});
export const socialLinkSchema = z.object({
  platform: socialPlatformSchema,
  url: requiredText("Social link URL").refine(
    (value) => new RegExp(LINK_URL_PATTERN).test(value),
    "Social link URL must be a valid URL or site path",
  ),
});
export const contactMethodSchema = z.object({
  kind: contactMethodKindSchema,
  title: requiredText("Contact method title"),
  value: requiredText("Contact method value"),
  sections: z.array(contactMethodSectionSchema),
});
export type ContactMethodInput = z.infer<typeof contactMethodSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
