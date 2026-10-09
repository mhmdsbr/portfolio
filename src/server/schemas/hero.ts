import { z } from "zod";
import { optionalText, optionalUrl } from "./common";
export const heroSchema = z.object({
  location: optionalText,
  subtitleOne: optionalText,
  subtitleTwo: optionalText,
  logoUrl: optionalUrl("Logo URL", "asset"),
});
export const heroTitlesSchema = z.array(
  z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : ""),
    z.string().min(1, "Hero title is required"),
  ),
);
