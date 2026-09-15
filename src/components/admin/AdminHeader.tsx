'use client'

export default function AdminHeader() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">
          Welcome back, Admin
        </h2>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            View Site →
          </a>
        </div>
      </div>
    </header>
  )
}