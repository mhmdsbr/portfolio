import { getAdminCount } from '@/server/services/admin-accounts'
import { redirect } from 'next/navigation'
import AdminSignupForm from '@/components/admin/forms/auth/AdminSignupForm'

export const dynamic = 'force-dynamic'

export default async function AdminSignupPage() {
  if ((await getAdminCount()) > 0) {
    redirect('/admin/login')
  }

  return <AdminSignupForm />
}
