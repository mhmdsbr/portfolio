'use client'

import { useRef } from 'react'
import useHeaderAnimations from '@/hooks/useHeaderAnimations'

export default function Header() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const expandRef = useRef<HTMLDivElement>(null)
  const reloadTextRef = useRef<HTMLSpanElement>(null)

  useHeaderAnimations({
    containerRef,
    headerRef,
    expandRef,
    reloadTextRef
  })

  return (
    <header ref={containerRef} className="flex justify-center w-full opacity-0">
      <div
        ref={headerRef}
        className="flex justify-center mt-10 text-2xl fixed lg:text-3xl font-semibold px-10 cursor-pointer top-0 z-50"
      >
        <span className="flex items-baseline">
          &lt;
          <span className="px-2">Welcome</span>
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