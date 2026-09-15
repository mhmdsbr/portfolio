'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateFooter } from '@/actions/footer'

interface FooterFormProps {
  initialData: {
    companyName: string
    privacyPolicy: string | null
    termsOfService: string | null
    copyrightText: string | null
  }
}

export default function FooterForm({ initialData }: FooterFormProps) {
  const [companyName, setCompanyName] = useState(initialData.companyName)
  const [privacyPolicy, setPrivacyPolicy] = useState(initialData.privacyPolicy || '')
  const [termsOfService, setTermsOfService] = useState(initialData.termsOfService || '')
  const [copyrightText, setCopyrightText] = useState(initialData.copyrightText || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.set('companyName', companyName)
    formData.set('privacyPolicy', privacyPolicy)
    formData.set('termsOfService', termsOfService)
    formData.set('copyrightText', copyrightText)

    try {
      await updateFooter(formData)
      router.refresh()
    } catch (error) {
      console.error('Error updating footer:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Company Name
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Privacy Policy (HTML allowed)
        </label>
        <textarea
          value={privacyPolicy}
          onChange={(e) => setPrivacyPolicy(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Enter privacy policy content..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Terms of Service (HTML allowed)
        </label>
        <textarea
          value={termsOfService}
          onChange={(e) => setTermsOfService(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Enter terms of service..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Copyright Text
        </label>
        <input
          type="text"
          value={copyrightText}
          onChange={(e) => setCopyrightText(e.target.value)}
          placeholder="All rights reserved."
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Footer Settings'}
      </button>
    </form>
  )
}