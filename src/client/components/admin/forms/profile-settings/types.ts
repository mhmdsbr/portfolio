import type { CurrentAdminProfile } from '@/shared/types'

export interface AdminAccount {
  id: number
  email: string
  displayName: string
  isActive: boolean
  createdAt: Date | null
}

export interface ProfileSettingsFormProps {
  admin: CurrentAdminProfile
  admins: AdminAccount[]
}
