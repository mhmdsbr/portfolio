"use server";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { ensurePortfolioSections } from "@/lib/db/portfolio-sections";

// =============================================
// GET
// =============================================

export async function getExperienceSectionData() {
  await requireAuth();

  const [[summary], [section]] = await Promise.all([
    db.select().from(schema.experienceSection).limit(1),
    db
      .select()
      .from(schema.pageSections)
      .where(eq(schema.pageSections.sectionKey, "experience"))
      .limit(1),
  ]);

  const jobs = await db
    .select()
    .from(schema.experiences)
    .orderBy(asc(schema.experiences.sortOrder), asc(schema.experiences.id));

  const experiences = await db
    .select()
    .from(schema.skills)
    .orderBy(asc(schema.skills.sortOrder), asc(schema.skills.id));

  return {
    ...summary,
    title: section?.title ?? null,
    overlayTitle: section?.overlayTitle ?? null,
    jobs,
    experiences,
  };
}

// =============================================
// UPDATE SUMMARY SECTION
// =============================================

export async function updateExperienceSection(formData: FormData) {
  await requireAuth();
  await ensurePortfolioSections();

  const buttonText = formData.get("buttonText") as string;
  const buttonUrl = formData.get("buttonUrl") as string;

  const values = {
    buttonText: buttonText || null,
    buttonUrl: buttonUrl || null,
  };
  const [existingSummary] = await db
    .select()
    .from(schema.experienceSection)
    .where(eq(schema.experienceSection.sectionKey, "experience"))
    .limit(1);
  const [summary] = existingSummary
    ? await db
        .update(schema.experienceSection)
        .set(values)
        .where(eq(schema.experienceSection.id, existingSummary.id))
        .returning()
    : await db
        .insert(schema.experienceSection)
        .values({ ...values, sectionKey: "experience" })
        .returning();

  revalidatePath("/admin/experience");
  revalidatePath("/api/all");

  return summary;
}

// =============================================
// JOB CRUD
// =============================================

export async function createJob(formData: FormData) {
  await requireAuth();

  const fromYearInput = String(formData.get("fromYear") ?? "").trim();
  const fromYear = Number(fromYearInput);
  if (!fromYearInput || !Number.isInteger(fromYear) || fromYear < 0) {
    throw new Error("Start year must be a valid year");
  }
  const toYearInput = String(formData.get("toYear") ?? "").trim();
  const toYear =
    toYearInput.toLowerCase() === "present" || toYearInput === ""
      ? null
      : Number(toYearInput);
  if (toYear !== null && (!Number.isInteger(toYear) || toYear < 0)) {
    throw new Error("End year must be a valid year or Present");
  }
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

  const fromYearInput = String(formData.get("fromYear") ?? "").trim();
  const fromYear = Number(fromYearInput);
  if (!fromYearInput || !Number.isInteger(fromYear) || fromYear < 0) {
    throw new Error("Start year must be a valid year");
  }
  const toYearInput = String(formData.get("toYear") ?? "").trim();
  const toYear =
    toYearInput.toLowerCase() === "present" || toYearInput === ""
      ? null
      : Number(toYearInput);
  if (toYear !== null && (!Number.isInteger(toYear) || toYear < 0)) {
    throw new Error("End year must be a valid year or Present");
  }
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
