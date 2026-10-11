import { getProfileSettings } from '@/actions/admin/profile'
import ProfileSettingsForm from '@/components/admin/forms/profile-settings/ProfileSettingsForm'

export default async function ProfileSettingsPage() {
  const { admin, admins } = await getProfileSettings()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin account</h1>
      <ProfileSettingsForm admin={admin} admins={admins} />
    </div>
  )
}
