import { z } from "zod";
import {
  ASSET_URL_PATTERN,
  CONTACT_METHOD_KINDS,
  CONTACT_METHOD_SECTION_KINDS,
  LINK_URL_PATTERN,
  SECTION_KINDS,
  SERVICE_ICONS,
  SOCIAL_PLATFORMS,
  WEB_URL_PATTERN,
  YEAR_MAX,
  YEAR_MIN,
} from "@/lib/db/constants";
import { ValidationError } from "@/server/services/shared";

export const optionalText = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() || null : null),
  z.string().nullable(),
);

export function requiredText(label: string) {
  return z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z.string().min(1, `${label} is required`),
  );
}

export function optionalUrl(
  label: string,
  kind: "web" | "asset" | "link" = "link",
) {
  const pattern =
    kind === "web"
      ? WEB_URL_PATTERN
      : kind === "asset"
        ? ASSET_URL_PATTERN
        : LINK_URL_PATTERN;
  return optionalText.refine(
    (value) => value === null || new RegExp(pattern).test(value),
    {
      message: `${label} must be a valid URL or site path`,
    },
  );
}

export function optionalInteger(
  label: string,
  bounds: { min?: number; max?: number } = {},
) {
  const range =
    bounds.min !== undefined && bounds.max !== undefined
      ? ` from ${bounds.min} to ${bounds.max}`
      : "";
  return z.preprocess(
    (value) => {
      if (typeof value === "number") return value;
      if (typeof value !== "string" || !value.trim()) return null;
      return Number(value.trim());
    },
    z
      .number({ error: `${label} must be a whole number${range}` })
      .int(`${label} must be a whole number${range}`)
      .min(
        bounds.min ?? Number.MIN_SAFE_INTEGER,
        `${label} must be a whole number${range}`,
      )
      .max(
        bounds.max ?? Number.MAX_SAFE_INTEGER,
        `${label} must be a whole number${range}`,
      )
      .nullable(),
  );
}

export function requiredInteger(
  label: string,
  bounds: { min?: number; max?: number } = {},
) {
  return optionalInteger(label, bounds)
    .refine((value) => value !== null, {
      message: `${label} is required`,
    })
    .transform((value) => value as number);
}

export const positiveId = z.coerce.number().int().positive("Invalid item id");
export const idListSchema = z
  .array(z.number().int().positive())
  .refine(
    (ids) => new Set(ids).size === ids.length,
    "Order must be a list of unique ids",
  );
export const sectionKindSchema = z.enum(SECTION_KINDS, {
  error: "Invalid portfolio section",
});
export const serviceIconSchema = z
  .enum(SERVICE_ICONS, { error: "Invalid service icon" })
  .nullable();
export const socialPlatformSchema = z.enum(SOCIAL_PLATFORMS);
export const contactMethodKindSchema = z.enum(CONTACT_METHOD_KINDS, {
  error: "Invalid contact method kind",
});
export const contactMethodSectionSchema = z.enum(CONTACT_METHOD_SECTION_KINDS);
export const yearSchema = z.number().int().min(YEAR_MIN).max(YEAR_MAX);

export function parseInput<S extends z.ZodType>(
  schema: S,
  value: unknown,
): z.output<S> {
  const result = schema.safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    const fieldPath = issue.path.map(String).join(".") || undefined;
    throw new ValidationError(issue.message, fieldPath);
  }
  return result.data;
}

export function parseForm<S extends z.ZodType>(
  schema: S,
  formData: FormData,
): z.output<S> {
  const raw: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
  const shape = schema instanceof z.ZodObject ? schema.shape : undefined;
  const keys = new Set([
    ...Array.from(formData.keys()),
    ...Object.keys(shape ?? {}),
  ]);
  for (const key of keys) {
    const values = formData.getAll(key);
    raw[key] =
      shape?.[key] instanceof z.ZodArray
        ? values
        : values.length > 1
          ? values
          : values[0];
  }
  return parseInput(schema, raw);
}

export const checkboxBoolean = z.preprocess((input) => {
  if (input === true || input === "true" || input === "on" || input === "1")
    return true;
  if (input === false || input === "false" || input === "0") return false;
  return input;
}, z.boolean());
