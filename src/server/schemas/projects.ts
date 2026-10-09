import { z } from "zod";
import { optionalText, optionalUrl, requiredText } from "./common";
export const projectSchema = z.object({
  title: requiredText("Project title"),
  category: requiredText("Project category"),
  description: optionalText,
  image: optionalUrl("Image", "asset"),
  link: optionalUrl("Link", "web"),
  githubUrl: optionalUrl("GitHub URL", "web"),
  roles: z.preprocess(
    (v) =>
      typeof v === "string"
        ? [
            ...new Set(
              v
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean),
            ),
          ]
        : [],
    z.array(z.string()),
  ),
  tech: z.preprocess(
    (v) =>
      typeof v === "string"
        ? [
            ...new Map(
              v
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .map((name) => [name.toLocaleLowerCase(), name]),
            ).values(),
          ]
        : [],
    z.array(z.string()),
  ),
});
export const projectClassificationsSchema = z
  .array(
    z.object({
      id: z.number().int().positive(),
      category: requiredText("Project category"),
      tech: z.array(requiredText("Technology")),
    }),
  )
  .min(1, "Invalid project category or technology updates")
  .refine(
    (updates) => new Set(updates.map(({ id }) => id)).size === updates.length,
    "Invalid project category or technology updates",
  );
