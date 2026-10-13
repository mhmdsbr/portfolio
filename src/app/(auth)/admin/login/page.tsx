import { getAdminCount } from '@/server/services/admin-accounts'
import { getSessionAdmin } from '@/server/auth/session'
import { redirect } from 'next/navigation'
import AdminLoginForm from '@/client/components/admin/forms/auth/AdminLoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  if (await getSessionAdmin()) {
    redirect('/admin')
  }

  if ((await getAdminCount()) === 0) {
    redirect('/admin/signup')
  }

  return <AdminLoginForm />
}
