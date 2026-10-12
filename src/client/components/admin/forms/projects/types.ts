import type { ActionResult } from '@/shared/types'

export interface CategorySelectProps {
  categories: string[]
  value: string
  onChange: (value: string) => void
  id?: string
  /** When set, the chosen category name is submitted in a hidden input. */
  name?: string
  ariaLabel?: string
  selectClassName?: string
  inputClassName?: string
}

export interface ProjectFormProps {
  initialData?: {
    id?: number
    title: string
    category: string
    description: string | null
    roles: string[] | null
    image: string | null
    link: string | null
    githubUrl: string | null
    tech: string[] | null
  }
  onSubmit: (formData: FormData) => Promise<ActionResult<{ id: number }>>
  submitLabel: string
  categories: string[]
}

export interface Project {
  id: number
  title: string
  category: string
  description: string | null
  image: string | null
  link: string | null
  githubUrl: string | null
  tech: string[] | null
  sortOrder: number | null
}

export interface ProjectsTableProps {
  projects: Project[]
  categories: string[]
}
