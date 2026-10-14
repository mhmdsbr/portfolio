import { z } from "zod";
import { optionalInteger, optionalText, requiredText } from "./common";
export const profileSchema = z.object({
  name: optionalText,
  jobTitle: optionalText,
  description: optionalText,
});
export const detailSchema = z.object({
  number: optionalInteger("Detail number"),
  title: requiredText("Detail title"),
});
