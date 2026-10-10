import { revalidatePath } from 'next/cache'

/**
 * Revalidates the admin paths that show edited content. Public pages are
 * force-dynamic and read the database on every request, so they need no
 * invalidation.
 */
export function revalidateContent(...paths: string[]) {
  for (const path of new Set(paths)) revalidatePath(path)
}

export function revalidateProjectCategoryPages() {
  revalidatePath('/projects/category/[slug]', 'page')
}
