'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { TextPlugin } from 'gsap/TextPlugin'

// Register plugins
gsap.registerPlugin(TextPlugin)

export default function Header() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const expandRef = useRef<HTMLDivElement>(null)
  const reloadTextRef = useRef<HTMLSpanElement>(null)

  // Entrance animation
  useGSAP(() => {
    if (!containerRef.current || !headerRef.current) return

    gsap.set(containerRef.current, { opacity: 0 })
    gsap.set(headerRef.current, { y: -200 })

    const tl = gsap.timeline()
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.2
    })
    .to(headerRef.current, {
      y: 40,
      duration: 1.5,
      ease: "bounce.out"
    })
  }, [])

  // Hover animation
  useGSAP(() => {
    const expandElement = expandRef.current
    const reloadText = reloadTextRef.current
    if (!expandElement || !reloadText) return

    // Store original text
    const originalText = reloadText.textContent || ''
    reloadText.textContent = ''

    const hoverTl = gsap.timeline({
      paused: true,
      defaults: { ease: "none" }
    })

    // Expand container
    hoverTl.to(expandElement, {
      maxWidth: 400,
      opacity: 1,
      paddingRight: '0.75rem',
      duration: 0.3
    })
    // Typing animation
    .to(reloadText, {
      text: {
        value: originalText,
        speed: .5,
        type: "diff"
      },
      duration: originalText.length * 0.08
    })

    // Event handlers
    const header = headerRef.current
    if (!header) return

    const playAnimation = () => hoverTl.play()
    const reverseAnimation = () => hoverTl.reverse()

    header.addEventListener('mouseenter', playAnimation)
    header.addEventListener('mouseleave', reverseAnimation)

    return () => {
      header.removeEventListener('mouseenter', playAnimation)
      header.removeEventListener('mouseleave', reverseAnimation)
    }
  }, [])

  return (
    <div ref={containerRef} className="flex py-5 justify-center w-full opacity-0">
      <div
        ref={headerRef}
        className="text-2xl lg:text-3xl font-semibold px-10 cursor-pointer"
      >
        <span className="flex items-baseline">
          &lt;
          <span className="text-accent px-2">Welcome</span>
          <div
            ref={expandRef}
            className="whitespace-nowrap overflow-hidden max-w-0 opacity-0 border-r-2 border-r-transparent"
          >
            <span ref={reloadTextRef}>onClick=&#123;reload&#125;</span>
          </div>
          /&gt;
        </span>
      </div>
    </div>
  )
}