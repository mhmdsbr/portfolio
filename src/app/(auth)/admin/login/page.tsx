import { getAdminCount } from '@/server/services/admin-accounts'
import { redirect } from 'next/navigation'
import AdminLoginForm from '@/client/components/admin/forms/auth/AdminLoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  if ((await getAdminCount()) === 0) {
    redirect('/admin/signup')
  }

  return <AdminLoginForm />
}
