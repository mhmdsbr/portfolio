'use client'

import { useRef } from 'react'
import useHeroAnimations from '@/hooks/useHeroAnimations'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLHeadingElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const line3Ref = useRef<HTMLSpanElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  useHeroAnimations({
    containerRef,
    line1Ref,
    line2Ref,
    line3Ref,
    descriptionRef
  })

  return (
    <section ref={containerRef} className="relative overflow-x-hidden h-screen min-h-[700px] flex flex-col items-center gap-4 justify-evenly text-center">
      <div>
        <h1 className="px-10" ref={line1Ref}>
          <span className="block text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl pink-gradient-text font-extrabold">MOHAMMAD SABER</span>
        </h1>
        <h2 className="flex justify-center gap-5">
          <span className="block md:text-2xl lg:text-3xl font-roboto font-semibold uppercase mt-8 opacity-0" ref={line2Ref}>Web Developer,</span>
          <span className="block md:text-2xl lg:text-3xl font-roboto font-semibold uppercase mt-8 opacity-0" ref={line3Ref}>English Instructor</span>
        </h2>
      </div>
      <div className="flex justify-center items-center h-16 text-white uppercase font-medium absolute left-auto lg:left-4 bottom-20 z-10">
        <div className="flex items-center bg-primary-cyan h-full border-r-1 rounded-l-xs border-white p-3 z-20">
          <p>Mo</p>
        </div>
        <div className="flex items-center bg-primary-orange h-full border-r-1 border-white p-2 z-20">
          <p>Berlin, Germany</p>
        </div>
        <div className="flex items-center bg-primary-purple h-full border-white p-2 z-20">
          <p>Be in Touch</p>
        </div>
        <div
          ref={descriptionRef}
          className="items-center bg-white text-black h-full border-r-6 rounded-r-md border-primary-cyan p-2 z-0 opacity-0 flex"
        >
          <p>Turning ideas into interactive, responsive, bug-resistant (ish) experiences.</p>
       </div>
      </div>
    </section>
  )
}