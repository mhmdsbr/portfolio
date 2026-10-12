import AdminSidebar from '@/client/components/admin/AdminSidebar'
import AdminHeader from '@/client/components/admin/AdminHeader'
import BackgroundGradient from '@/client/components/common/backgroundGradient'
import { requireAuth } from '@/server/auth/session'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()

  return (
    <div className="relative min-h-screen bg-gray-900/60 text-white">
      <BackgroundGradient className="fixed inset-0 z-0 h-full w-full pointer-events-none" />
      <div className="relative z-10 flex min-h-screen">
        <AdminSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}