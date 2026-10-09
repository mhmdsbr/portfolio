export interface CurrentAdmin {
  id: number
  email: string
}

export interface CurrentAdminProfile extends CurrentAdmin {
  displayName: string
  bio: string | null
  preferences: Record<string, unknown>
}
