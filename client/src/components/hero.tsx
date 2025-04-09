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
    <section ref={containerRef} className="relative overflow-x-hidden h-[80vh] flex flex-col items-center gap-4 justify-evenly text-center">
      <div>
        <h1 className="px-10" ref={line1Ref}>
          <span className="block text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl pink-gradient-text font-extrabold">MOHAMMAD SABER</span>
        </h1>
        <h2 className="flex justify-center gap-5">
          <span className="block md:text-2xl lg:text-3xl font-roboto font-semibold uppercase mt-8 opacity-0" ref={line2Ref}>Web Developer,</span>
          <span className="block md:text-2xl lg:text-3xl font-roboto font-semibold uppercase mt-8 opacity-0" ref={line3Ref}>English Instructor</span>
        </h2>
      </div>
      <div className="flex justify-center items-center text-white absolute left-auto lg:left-4 bottom-0 z-10">
        <p className="bg-primary-cyan border-r-1 border-white p-5 z-20">Mo</p>
        <p className="bg-primary-orange border-r-1 border-white p-5 z-20">Berlin, Germany</p>
        <p className="bg-primary-purple border-white p-5 z-20">Be in touch</p>
        <p
          ref={descriptionRef}
          className="bg-white text-black border-r-4 border-primary-cyan p-5 z-0 hidden lg:block"
        >
          Turning ideas into interactive, responsive, bug-resistant (ish) experiences.
       </p>
      </div>
    </section>
  )
}