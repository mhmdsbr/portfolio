'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FiHome,
  FiBriefcase,
  FiUser,
  FiTool,
  FiMessageSquare,
  FiAward,
  FiLogOut,
  FiMenu,
  FiFileText,
  FiLayout,
  FiMail,
  FiSettings,
} from 'react-icons/fi'

const navGroups = [
  {
    label: 'Workspace',
    items: [{ href: '/admin', label: 'Dashboard', icon: FiHome }],
  },
  {
    label: 'Portfolio content',
    items: [
      { href: '/admin/about', label: 'Profile & About', icon: FiUser },
      { href: '/admin/hero', label: 'Hero content', icon: FiLayout },
      { href: '/admin/experience', label: 'Career & Skills', icon: FiTool },
      { href: '/admin/projects', label: 'Projects', icon: FiBriefcase },
      { href: '/admin/services', label: 'Services', icon: FiAward },
      { href: '/admin/testimonials', label: 'Testimonials', icon: FiMessageSquare },
      { href: '/admin/contact', label: 'Contact content', icon: FiMail },
    ],
  },
  {
    label: 'Page presentation',
    items: [
      { href: '/admin/header', label: 'Page layout', icon: FiMenu },
      { href: '/admin/footer', label: 'Footer', icon: FiFileText },
    ],
  },
  {
    label: 'Site settings',
    items: [
      { href: '/admin/general-settings', label: 'General settings', icon: FiSettings },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/admin/profile-settings', label: 'Admin account', icon: FiUser },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setLogoutError('')

    try {
      const response = await fetch('/api/admin/auth', { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Unable to log out. Please try again.')
      }

      window.location.assign('/admin/login')
    } catch {
      setLogoutError('Unable to log out. Please try again.')
      setIsLoggingOut(false)
    }
  }

  return (
    <aside className="w-64 shrink-0 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-cyan-400">Portfolio CMS</h1>
      </div>

      <nav aria-label="Admin navigation" className="min-h-0 flex-1 overflow-y-auto p-4">
        {navGroups.map(({ label: groupLabel, items }) => (
          <section key={groupLabel} className="mb-5 last:mb-0">
            <h2 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {groupLabel}
            </h2>
            <div className="space-y-1">
              {items.map(({ href, label, icon: Icon }) => {
                const isActive = href === '/admin'
                  ? pathname === href
                  : pathname === href || pathname.startsWith(`${href}/`)

                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        {logoutError && (
          <p role="alert" className="mb-2 text-sm text-red-400">
            {logoutError}
          </p>
        )}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
        >
          <FiLogOut className="w-5 h-5" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}