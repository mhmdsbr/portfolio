export interface CurrentAdminProfile {
  id: number
  email: string
  displayName: string
  bio: string | null
  preferences: Record<string, unknown>
}
