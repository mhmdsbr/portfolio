'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { HeaderAnimationRefs } from '@/types/animation'

gsap.registerPlugin(TextPlugin, ScrollTrigger)

export default function useHeaderAnimations({
  containerRef,
  headerRef,
  expandRef,
  reloadTextRef,
}: HeaderAnimationRefs) {
  useEffect(() => {
    if (!containerRef.current || !headerRef.current) return

    gsap.set(containerRef.current, { opacity: 0 })
    gsap.set(headerRef.current, { y: -200 })

    const tl = gsap.timeline()
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.5
    }).to(headerRef.current, {
      y: 0,
      duration: 1.5,
      ease: 'bounce.out'
    })

  }, [containerRef, headerRef])

  useEffect(() => {
    const expandElement = expandRef.current
    const reloadText = reloadTextRef.current
    const header = headerRef.current

    if (!expandElement || !reloadText || !header) return

    const originalText = reloadText.textContent || ''
    reloadText.textContent = ''

    const hoverTl = gsap.timeline({ paused: true })

    hoverTl.to(expandElement, {
      maxWidth: 400,
      opacity: 1,
      paddingRight: '0.75rem',
      duration: 0.5,
      ease: 'power1.in'
    }).to(reloadText, {
      text: {
        value: originalText,
        speed: 1
      },
      duration: originalText.length * 0.05
    })

    const playAnimation = () => hoverTl.play()
    const reverseAnimation = () => hoverTl.reverse()

    header.addEventListener('mouseenter', playAnimation)
    header.addEventListener('mouseleave', reverseAnimation)

    return () => {
      header.removeEventListener('mouseenter', playAnimation)
      header.removeEventListener('mouseleave', reverseAnimation)
    }
  }, [expandRef, reloadTextRef, headerRef])
}