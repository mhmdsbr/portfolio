import { getGeneralSettings } from '@/actions/config'
import GeneralSettingsForm from '@/components/admin/GeneralSettingsForm'

export default async function GeneralSettingsPage() {
  const settings = await getGeneralSettings()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">General Settings</h1>
      <GeneralSettingsForm initialData={settings} />
    </div>
  )
}
