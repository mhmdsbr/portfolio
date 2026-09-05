'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

// =============================================
// GET
// =============================================

export async function getSummary() {
  await requireAuth()
  
  const [summary] = await db.select()
    .from(schema.summarySection)
    .limit(1)
  
  const jobs = await db.select()
    .from(schema.summaryJobs)
    .orderBy(asc(schema.summaryJobs.sortOrder))
  
  const experiences = await db.select()
    .from(schema.summaryExperiences)
    .orderBy(asc(schema.summaryExperiences.sortOrder))
  
  return {
    ...summary,
    jobs,
    experiences,
  }
}

// =============================================
// UPDATE SUMMARY SECTION
// =============================================

export async function updateSummary(formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const overlayTitle = formData.get('overlayTitle') as string
  const buttonText = formData.get('buttonText') as string
  const buttonUrl = formData.get('buttonUrl') as string
  
  const [summary] = await db.update(schema.summarySection)
    .set({
      title: title || null,
      overlayTitle: overlayTitle || null,
      buttonText: buttonText || null,
      buttonUrl: buttonUrl || null,
    })
    .where(eq(schema.summarySection.id, 1))
    .returning()
  
  revalidatePath('/admin/experience')
  revalidatePath('/api/all')
  
  return summary
}

// =============================================
// JOB CRUD
// =============================================

export async function createJob(formData: FormData) {
  await requireAuth()
  
  const fromYear = parseInt(formData.get('fromYear') as string)
  const toYear = formData.get('toYear') as string
  const jobTitle = formData.get('jobTitle') as string
  const company = formData.get('company') as string
  const description = formData.get('description') as string
  
  const [summary] = await db.select()
    .from(schema.summarySection)
    .limit(1)
  
  if (!summary) {
    throw new Error('Summary section not found')
  }
  
  // Get current max sort order
  const existing = await db.select()
    .from(schema.summaryJobs)
    .where(eq(schema.summaryJobs.summaryId, summary.id))
    .orderBy(asc(schema.summaryJobs.sortOrder))
  
  const sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0
  
  const [job] = await db.insert(schema.summaryJobs)
    .values({
      summaryId: summary.id,
      fromYear: fromYear || null,
      toYear: toYear || null,
      jobTitle,
      company,
      description: description || null,
      sortOrder,
    })
    .returning()
  
  revalidatePath('/admin/experience')
  revalidatePath('/api/all')
  
  return job
}

export async function updateJob(id: number, formData: FormData) {
  await requireAuth()
  
  const fromYear = parseInt(formData.get('fromYear') as string)
  const toYear = formData.get('toYear') as string
  const jobTitle = formData.get('jobTitle') as string
  const company = formData.get('company') as string
  const description = formData.get('description') as string
  
  const [job] = await db.update(schema.summaryJobs)
    .set({
      fromYear: fromYear || null,
      toYear: toYear || null,
      jobTitle,
      company,
      description: description || null,
    })
    .where(eq(schema.summaryJobs.id, id))
    .returning()
  
  revalidatePath('/admin/experience')
  revalidatePath('/api/all')
  
  return job
}

export async function deleteJob(id: number) {
  await requireAuth()
  
  await db.delete(schema.summaryJobs)
    .where(eq(schema.summaryJobs.id, id))
  
  revalidatePath('/admin/experience')
  revalidatePath('/api/all')
}

export async function reorderJobs(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) =>
      db.update(schema.summaryJobs)
        .set({ sortOrder: index })
        .where(eq(schema.summaryJobs.id, id))
    )
  )
  
  revalidatePath('/admin/experience')
  revalidatePath('/api/all')
}

// =============================================
// EXPERIENCE (SKILLS) CRUD
// =============================================

export async function createExperience(formData: FormData) {
  await requireAuth()
  
  const skill = formData.get('skill') as string
  const level = parseInt(formData.get('level') as string)
  
  const [summary] = await db.select()
    .from(schema.summarySection)
    .limit(1)
  
  if (!summary) {
    throw new Error('Summary section not found')
  }
  
  // Get current max sort order
  const existing = await db.select()
    .from(schema.summaryExperiences)
    .where(eq(schema.summaryExperiences.summaryId, summary.id))
    .orderBy(asc(schema.summaryExperiences.sortOrder))
  
  const sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0
  
  const [experience] = await db.insert(schema.summaryExperiences)
    .values({
      summaryId: summary.id,
      skill,
      level: level || null,
      sortOrder,
    })
    .returning()
  
  revalidatePath('/admin/experience')
  revalidatePath('/api/all')
  
  return experience
}

export async function updateExperience(id: number, formData: FormData) {
  await requireAuth()
  
  const skill = formData.get('skill') as string
  const level = parseInt(formData.get('level') as string)
  
  const [experience] = await db.update(schema.summaryExperiences)
    .set({
      skill,
      level: level || null,
    })
    .where(eq(schema.summaryExperiences.id, id))
    .returning()
  
  revalidatePath('/admin/experience')
  revalidatePath('/api/all')
  
  return experience
}

export async function deleteExperience(id: number) {
  await requireAuth()
  
  await db.delete(schema.summaryExperiences)
    .where(eq(schema.summaryExperiences.id, id))
  
  revalidatePath('/admin/experience')
  revalidatePath('/api/all')
}

export async function reorderExperiences(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) =>
      db.update(schema.summaryExperiences)
        .set({ sortOrder: index })
        .where(eq(schema.summaryExperiences.id, id))
    )
  )
  
  revalidatePath('/admin/experience')
  revalidatePath('/api/all')
}