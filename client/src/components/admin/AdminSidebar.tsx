'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiHome, 
  FiBriefcase, 
  FiUser, 
  FiTool, 
  FiMessageSquare, 
  FiStar,
  FiLogOut,
  FiMenu,
  FiFileText
} from 'react-icons/fi'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FiHome },
  { href: '/admin/header', label: 'Header', icon: FiMenu },
  { href: '/admin/footer', label: 'Footer', icon: FiFileText },
  { href: '/admin/projects', label: 'Projects', icon: FiBriefcase },
  { href: '/admin/about', label: 'About', icon: FiUser },
  { href: '/admin/experience', label: 'Experience', icon: FiTool },
  { href: '/admin/services', label: 'Services', icon: FiStar },
  { href: '/admin/testimonials', label: 'Testimonials', icon: FiMessageSquare },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    window.location.href = '/admin/login'
  }

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-cyan-400">Portfolio CMS</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
              pathname === href
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}