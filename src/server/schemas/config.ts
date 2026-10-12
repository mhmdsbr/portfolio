import { z } from "zod";
import { optionalText } from "./common";
export const generalSettingsSchema = z.object({
  recaptchaSiteKey: optionalText,
});
