export interface Experience {
  id: number
  fromYear: number | null
  toYear: number | null
  jobTitle: string
  company: string
  description: string | null
  sortOrder: number | null
}

export interface ExperiencesFormProps {
  experiences: Experience[]
}

export interface Skill {
  id: number
  skill: string
  level: number | null
  sortOrder: number | null
}

export interface SkillsFormProps {
  skills: Skill[]
}
