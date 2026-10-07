import { getAdminCount } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  if ((await getAdminCount()) === 0) {
    redirect('/admin/signup')
  }

  return <AdminLoginForm />
}
