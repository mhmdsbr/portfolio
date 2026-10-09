import { z } from "zod";
import { optionalText } from "./common";
export const footerSchema = z.object({
  companyName: optionalText,
  privacyPolicy: optionalText,
  termsOfService: optionalText,
  copyrightText: optionalText,
});
