import { getAdminCount } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSignupForm from '@/components/admin/AdminSignupForm'

export const dynamic = 'force-dynamic'

export default async function AdminSignupPage() {
  if ((await getAdminCount()) > 0) {
    redirect('/admin/login')
  }

  return <AdminSignupForm />
}
