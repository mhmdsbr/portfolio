'use client'

import { useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { Button, Heading } from '@/client/components/public/atoms'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  htmlContent: string
}

const ANIMATION_DURATION = 250

const Modal = ({ isOpen, onClose, title, htmlContent }: ModalProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    let visibleTimeout: ReturnType<typeof setTimeout>
    let unmountTimeout: ReturnType<typeof setTimeout>

    if (isOpen) {
      setShouldRender(true)
      visibleTimeout = setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
      unmountTimeout = setTimeout(() => setShouldRender(false), ANIMATION_DURATION)
    }

    return () => {
      clearTimeout(visibleTimeout)
      clearTimeout(unmountTimeout)
    }
  }, [isOpen])

  useEffect(() => {
    if (!shouldRender) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shouldRender, onClose])

  useEffect(() => {
    if (shouldRender) {
      const originalBodyOverflow = document.body.style.overflow
      const originalDocumentOverflow = document.documentElement.style.overflow
      const originalBodyOverscrollBehavior = document.body.style.overscrollBehavior

      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.overscrollBehavior = 'none'
      lenis?.stop()

      return () => {
        document.documentElement.style.overflow = originalDocumentOverflow
        document.body.style.overflow = originalBodyOverflow
        document.body.style.overscrollBehavior = originalBodyOverscrollBehavior
        lenis?.start()
      }
    }
  }, [lenis, shouldRender])

  if (!shouldRender) return null

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4 backdrop-blur-md bg-white/10 transition-all duration-250 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-250 ease-out ${
          isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur px-6 py-4 rounded-t-2xl">
          <Heading as="h3" size="lg" color="gray-900" weight="semibold">
            {title}
          </Heading>
          <Button
            variant="icon"
            size="small"
            onClick={onClose}
            ariaLabel={`Close ${title}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <div
          data-lenis-prevent
          className="prose prose-sm min-h-0 max-w-none overflow-y-auto px-6 py-5 text-gray-700"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  )
}

export default Modal