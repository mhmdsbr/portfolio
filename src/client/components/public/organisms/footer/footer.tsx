'use client'

import { useState, useCallback } from 'react'
import type { FooterResponse } from '@/shared/types'
import Modal from '@/client/components/public/molecules/modal/Modal'
import SectionLayout from '@/client/components/public/molecules/SectionLayout'
import { Button, Typography } from "@/client/components/public/atoms";

const Footer = ({ footerData }: { footerData: FooterResponse }) => {

  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const closePrivacy = useCallback(() => setShowPrivacy(false), [])
  const closeTerms = useCallback(() => setShowTerms(false), [])

  return (
    <>
      <footer className="bg-gray-900 text-white py-8">
        <SectionLayout width="wide" className="flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <Typography size="sm" color="inherit" align="footer">
            © {new Date().getFullYear()} {footerData?.companyName || 'Your Company'}. {footerData?.copyrightText || 'All rights reserved.'}
          </Typography>
          <div className="flex gap-4">
            {footerData?.privacyPolicy && (
              <Button
                variant="subtle"
                onClick={() => setShowPrivacy(true)}
              >
                Privacy Policy
              </Button>
            )}
            {footerData?.termsOfService && (
              <Button
                variant="subtle"
                onClick={() => setShowTerms(true)}
              >
                Terms of Service
              </Button>
            )}
          </div>
        </SectionLayout>
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