import { z } from "zod";
import { YEAR_MAX, YEAR_MIN } from "@/lib/db/constants";
import { optionalInteger, optionalText, requiredText } from "./common";
const startYear = z.preprocess(
  (v) => (typeof v === "string" ? Number(v.trim()) : v),
  z
    .number({ error: "Start year must be a valid year" })
    .int("Start year must be a valid year")
    .min(YEAR_MIN, "Start year must be a valid year")
    .max(YEAR_MAX, "Start year must be a valid year"),
);
const endYear = z.preprocess(
  (v) =>
    typeof v === "string"
      ? v.trim().toLowerCase() === "present" || !v.trim()
        ? null
        : Number(v.trim())
      : v,
  z
    .number({
      error:
        "End year must be a valid year, not before the start year, or Present",
    })
    .int("End year must be a valid year, not before the start year, or Present")
    .min(
      YEAR_MIN,
      "End year must be a valid year, not before the start year, or Present",
    )
    .max(
      YEAR_MAX,
      "End year must be a valid year, not before the start year, or Present",
    )
    .nullable(),
);
export const experienceSchema = z
  .object({
    fromYear: startYear,
    toYear: endYear,
    jobTitle: requiredText("Job title"),
    company: requiredText("Company"),
    description: optionalText,
  })
  .superRefine((value, ctx) => {
    if (value.toYear !== null && value.toYear < value.fromYear)
      ctx.addIssue({
        code: "custom",
        path: ["toYear"],
        message:
          "End year must be a valid year, not before the start year, or Present",
      });
  });
export const skillSchema = z.object({
  skill: requiredText("Skill"),
  level: optionalInteger("Skill level", { min: 0, max: 100 }),
});
