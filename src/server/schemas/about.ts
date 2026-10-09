import { z } from "zod";
import { optionalText, requiredInteger, requiredText } from "./common";
export const profileSchema = z.object({
  name: optionalText,
  jobTitle: optionalText,
  description: optionalText,
});
export const detailSchema = z.object({
  number: requiredInteger("Detail number"),
  title: requiredText("Detail title"),
});
