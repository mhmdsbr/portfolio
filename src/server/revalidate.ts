import { revalidatePath } from 'next/cache'

const PUBLIC_API_ALL = '/api/all'

/** Invalidates the public aggregate endpoint plus any page-specific paths. */
export function revalidateContent(...paths: string[]) {
  for (const path of new Set([...paths, PUBLIC_API_ALL])) revalidatePath(path)
}

export function revalidateProjectCategoryPages() {
  revalidatePath('/projects/category/[slug]', 'page')
}
