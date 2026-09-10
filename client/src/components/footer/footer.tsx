'use client'

import { useState, useCallback } from 'react'
import { useAllData } from '@/hooks/useAllData'
import Modal from '@/components/footer/Modal'

const Footer = () => {
  const { data: allData } = useAllData()
  const footerData = allData?.footer

  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const closePrivacy = useCallback(() => setShowPrivacy(false), [])
  const closeTerms = useCallback(() => setShowTerms(false), [])

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

      {footerData?.privacyPolicy && (
        <Modal
          isOpen={showPrivacy}
          onClose={closePrivacy}
          title="Privacy Policy"
          htmlContent={footerData.privacyPolicy}
        />
      )}

      {footerData?.termsOfService && (
        <Modal
          isOpen={showTerms}
          onClose={closeTerms}
          title="Terms of Service"
          htmlContent={footerData.termsOfService}
        />
      )}
    </>
  )
}

export default Footer