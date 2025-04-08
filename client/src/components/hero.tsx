'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const line3Ref = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    gsap.set(line1Ref.current, { y: 0, scale: 0 });
    const firstLineTl = gsap.timeline();
    firstLineTl.to(line1Ref.current, {
      scale: 2,
      duration: 1.5,
      ease: "power2.out"
    });

    firstLineTl.to(line1Ref.current, {
      y: -150,
      duration: 1,
      ease: "elastic.out(1, .5)"
    });

    // Create timeline for scroll-triggered animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 10%",
        end: "+=200%", // Scroll distance for all animations
        scrub: 1, // Smooth scrubbing
        pin: true, // Pins the element during scroll
        markers: false
      }
    })

    tl.fromTo(
      line2Ref.current,
      { scale: 4, y: 0, opacity: 0 },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "back.out(3)",
        onUpdate: function () {
          const progress = this.progress(); // 0 → 1
          // Interpolate from colorA to colorB
          const colorA = { r: 255, g: 0, b: 0 };
          const colorB = { r: 0, g: 255, b: 0 };

          const r = Math.floor(colorA.r + (colorB.r - colorA.r) * progress);
          const g = Math.floor(colorA.g + (colorB.g - colorA.g) * progress);
          const b = Math.floor(colorA.b + (colorB.b - colorA.b) * progress);

          gsap.set(line2Ref.current, {
            color: `rgb(${r}, ${g}, ${b})`
          });
        },
      },
      "+=0.1"
    )
    .to(
      line2Ref.current,
      {
        y: -100,
        duration: 0.7,
        ease: "back.out(2)",
        onUpdate: function () {
          const progress = this.progress();
          // Now interpolate from Green → Blue
          const colorA = { r: 0, g: 255, b: 0 };
          const colorB = { r: 0, g: 0, b: 255 };

          const r = Math.floor(colorA.r + (colorB.r - colorA.r) * progress);
          const g = Math.floor(colorA.g + (colorB.g - colorA.g) * progress);
          const b = Math.floor(colorA.b + (colorB.b - colorA.b) * progress);

          gsap.set(line2Ref.current, {
            color: `rgb(${r}, ${g}, ${b})`
          });
        },
      },
      ">0.3"
    );

    // Third line animation (slide up from bottom)
    tl.fromTo(line3Ref.current,
      { y: window.innerHeight/2, scale: 4, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" },
      "-=0.3"
    )
    .to(line3Ref.current,
      { y: -100, duration: 1, ease: "elastic.out(1, 0.5)" },
      ">0.2" // Starts 0.2s after scaling completes
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="h-screen flex flex-col space-y-8 items-center justify-center text-center">
      <div className="z-20">
        <h1 className="text-4xl lg:text-6xl font-semibold px-10">
          <span className="block" ref={line1Ref}>Hi, I&apos;m Mo</span>
          <span className="block mt-8 opacity-0" ref={line2Ref}>A Web Developer</span>
          <span className="block mt-8 opacity-0" ref={line3Ref}>An English Instructor</span>
        </h1>
      </div>
    </div>
  )
}