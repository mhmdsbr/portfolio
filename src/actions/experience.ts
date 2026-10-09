"use server";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { YEAR_MAX, YEAR_MIN } from "@/lib/db/constants";
import { getSection, updateSectionConfig } from "@/lib/db/sections";

// =============================================
// GET
// =============================================

export async function getExperienceSectionData() {
  await requireAuth();

  const [section, jobs, experiences] = await Promise.all([
    getSection("experience"),
    db
      .select()
      .from(schema.experiences)
      .orderBy(asc(schema.experiences.sortOrder), asc(schema.experiences.id)),
    db
      .select()
      .from(schema.skills)
      .orderBy(asc(schema.skills.sortOrder), asc(schema.skills.id)),
  ]);

  return {
    id: 0,
    buttonText: section?.config.buttonText ?? null,
    buttonUrl: section?.config.buttonUrl ?? null,
    title: section?.title ?? null,
    jobs,
    experiences,
  };
}

// =============================================
// UPDATE SUMMARY SECTION
// =============================================

export async function updateExperienceSection(formData: FormData) {
  await requireAuth();

  const { config } = await updateSectionConfig("experience", {
    buttonText: formData.get("buttonText"),
    buttonUrl: formData.get("buttonUrl"),
  });

  revalidatePath("/admin/experience");
  revalidatePath("/api/all");

  return config;
}

function parseJobYears(formData: FormData) {
  const fromYearInput = String(formData.get("fromYear") ?? "").trim();
  const fromYear = Number(fromYearInput);
  if (
    !fromYearInput ||
    !Number.isInteger(fromYear) ||
    fromYear < YEAR_MIN ||
    fromYear > YEAR_MAX
  ) {
    throw new Error("Start year must be a valid year");
  }
  const toYearInput = String(formData.get("toYear") ?? "").trim();
  const toYear =
    toYearInput.toLowerCase() === "present" || toYearInput === ""
      ? null
      : Number(toYearInput);
  if (
    toYear !== null &&
    (!Number.isInteger(toYear) || toYear < fromYear || toYear > YEAR_MAX)
  ) {
    throw new Error("End year must be a valid year, not before the start year, or Present");
  }
  return { fromYear, toYear };
}

// =============================================
// JOB CRUD
// =============================================

export async function createJob(formData: FormData) {
  await requireAuth();

  const { fromYear, toYear } = parseJobYears(formData);
  const jobTitle = formData.get("jobTitle") as string;
  const company = formData.get("company") as string;
  const description = formData.get("description") as string;

  const existing = await db
    .select()
    .from(schema.experiences)
    .orderBy(asc(schema.experiences.sortOrder), asc(schema.experiences.id));

  const sortOrder =
    existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0;

  const [job] = await db
    .insert(schema.experiences)
    .values({
      fromYear,
      toYear,
      jobTitle,
      company,
      description: description || null,
      sortOrder,
    })
    .returning();

  revalidatePath("/admin/experience");
  revalidatePath("/api/all");

  return job;
}

export async function updateJob(id: number, formData: FormData) {
  await requireAuth();

  const { fromYear, toYear } = parseJobYears(formData);
  const jobTitle = formData.get("jobTitle") as string;
  const company = formData.get("company") as string;
  const description = formData.get("description") as string;

  const [job] = await db
    .update(schema.experiences)
    .set({
      fromYear,
      toYear,
      jobTitle,
      company,
      description: description || null,
    })
    .where(eq(schema.experiences.id, id))
    .returning();

  revalidatePath("/admin/experience");
  revalidatePath("/api/all");

  return job;
}

export async function deleteJob(id: number) {
  await requireAuth();

  await db.delete(schema.experiences).where(eq(schema.experiences.id, id));

  revalidatePath("/admin/experience");
  revalidatePath("/api/all");
}

export async function reorderJobs(ids: number[]) {
  await requireAuth();

  await Promise.all(
    ids.map((id, index) =>
      db
        .update(schema.experiences)
        .set({ sortOrder: index })
        .where(eq(schema.experiences.id, id)),
    ),
  );

  revalidatePath("/admin/experience");
  revalidatePath("/api/all");
}

// =============================================
// EXPERIENCE (SKILLS) CRUD
// =============================================

export async function createSkill(formData: FormData) {
  await requireAuth();

  const skill = formData.get("skill") as string;
  const level = parseInt(formData.get("level") as string);

  const existing = await db
    .select()
    .from(schema.skills)
    .orderBy(asc(schema.skills.sortOrder), asc(schema.skills.id));

  const sortOrder =
    existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0;

  const [experience] = await db
    .insert(schema.skills)
    .values({
      skill,
      level: level || null,
      sortOrder,
    })
    .returning();

  revalidatePath("/admin/experience");
  revalidatePath("/api/all");

  return experience;
}

export async function updateSkill(id: number, formData: FormData) {
  await requireAuth();

  const skill = formData.get("skill") as string;
  const level = parseInt(formData.get("level") as string);

  const [experience] = await db
    .update(schema.skills)
    .set({
      skill,
      level: level || null,
    })
    .where(eq(schema.skills.id, id))
    .returning();

  revalidatePath("/admin/experience");
  revalidatePath("/api/all");

  return experience;
}

export async function deleteSkill(id: number) {
  await requireAuth();

  await db.delete(schema.skills).where(eq(schema.skills.id, id));

  revalidatePath("/admin/experience");
  revalidatePath("/api/all");
}

export async function reorderSkills(ids: number[]) {
  await requireAuth();

  await Promise.all(
    ids.map((id, index) =>
      db
        .update(schema.skills)
        .set({ sortOrder: index })
        .where(eq(schema.skills.id, id)),
    ),
  );

  revalidatePath("/admin/experience");
  revalidatePath("/api/all");
}
