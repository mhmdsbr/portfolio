'use client'

import { useState } from 'react'
import { useAllData } from '@/hooks/useAllData'

const Footer = () => {
  const { data: allData } = useAllData()
  const footerData = allData?.footer

  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  return (
    <>
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-center md:text-left">
            © {new Date().getFullYear()} {footerData?.companyName || 'Your Company'}. {footerData?.copyrightText || 'All rights reserved.'}
          </p>
          <div className="flex gap-4">
            {footerData?.privacyPolicy && (
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-sm hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
            )}
            {footerData?.termsOfService && (
              <button
                onClick={() => setShowTerms(true)}
                className="text-sm hover:underline cursor-pointer"
              >
                Terms of Service
              </button>
            )}
          </div>
        </div>
      </footer>

      {showPrivacy && footerData?.privacyPolicy && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-xl w-full rounded-lg p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowPrivacy(false)}
              className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-gray-800"
              aria-label="Close Privacy Policy"
            >
              &times;
            </button>
            <div className="mt-4 prose prose-sm max-w-none text-gray-700" 
              dangerouslySetInnerHTML={{ __html: footerData.privacyPolicy }} 
            />
          </div>
        </div>
      )}

      {showTerms && footerData?.termsOfService && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-xl w-full rounded-lg p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-gray-800"
              aria-label="Close Terms of Service"
            >
              &times;
            </button>
            <div className="mt-4 prose prose-sm max-w-none text-gray-700" 
              dangerouslySetInnerHTML={{ __html: footerData.termsOfService }} 
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Footer