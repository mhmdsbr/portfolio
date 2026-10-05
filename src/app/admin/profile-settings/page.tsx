import { getProfileSettings } from '@/actions/profile'
import ProfileSettingsForm from '@/components/admin/ProfileSettingsForm'

export default async function ProfileSettingsPage() {
  const { admin, admins } = await getProfileSettings()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      <ProfileSettingsForm admin={admin} admins={admins} />
    </div>
  )
}
