'use client'

import { useRef, useState } from 'react'
import useHeaderAnimations from '@/hooks/animations/useHeaderAnimations'

export default function Header() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const expandRef = useRef<HTMLDivElement>(null)
  const reloadTextRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)

  const [currentTitle, setCurrentTitle] = useState('Welcome')

  useHeaderAnimations({
    containerRef,
    headerRef,
    expandRef,
    reloadTextRef,
    titleRef,
    setCurrentTitle
  })

  return (
    <header ref={containerRef} className="flex justify-center w-full opacity-0 z-50">
      <div
        ref={headerRef}
        className="flex justify-center w-full py-5 text-2xl fixed lg:text-3xl font-semibold px-10 cursor-pointer top-0 z-50"
      >
        <span className="flex items-baseline">
          &lt;
          <span ref={titleRef} className="px-2">{currentTitle}</span>
          <div
            ref={expandRef}
            className="whitespace-nowrap text-primary-orange overflow-hidden max-w-0 opacity-0 border-r-2 border-r-transparent"
          >
            <span ref={reloadTextRef}>onClick=&#123;reload&#125;</span>
          </div>
          <span className="text-purple-500">
            /&gt;
          </span>
        </span>
      </div>
    </header>
  )
}