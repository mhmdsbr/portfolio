export interface AboutFormProps {
  profile: {
    name: string | null
    jobTitle: string | null
    biography: string | null
  }
}

export interface Detail {
  id: number
  number: number | null
  title: string
  sortOrder: number | null
}

export interface AboutDetailsFormProps {
  details: Detail[]
}
