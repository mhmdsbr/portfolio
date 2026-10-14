'use client'

import { useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Heading, Typography } from "@/client/components/public/atoms";
import SectionLayout from "@/client/components/public/molecules/SectionLayout";

const INTRO_VIDEO_URL = 'https://video.sabermohamad.de/intro.mp4'

export default function Intro() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    if (!isVideoOpen) return

    const originalBodyOverflow = document.body.style.overflow
    const originalDocumentOverflow = document.documentElement.style.overflow
    const originalBodyOverscrollBehavior = document.body.style.overscrollBehavior

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    lenis?.stop()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsVideoOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalDocumentOverflow
      document.body.style.overscrollBehavior = originalBodyOverscrollBehavior
      lenis?.start()
    }
  }, [isVideoOpen, lenis])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 text-white sm:px-8">
      <SectionLayout width="narrow" className="relative z-10">
      <section className="w-full rounded-3xl border border-white/10 bg-gray-950/60 p-7 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:p-12 md:p-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-cyan-300"
        >
          <span aria-hidden="true">←</span>
          Back to home
        </Link>
        <Typography
          size="sm"
          color="accent"
          weight="semibold"
          transform="uppercase"
          tracking="widest"
          spacing="bottomLarge"
        >
          Video introduction
        </Typography>
        <Heading
          as="h1"
          size="intro"
          color="inherit"
          weight="bold"
        >
          Tomorrow University of Applied Sciences
        </Heading>
        <Button
          variant="media"
          onClick={() => setIsVideoOpen(true)}
          ariaLabel="Play video introduction"
        >
          <Image
            src="/intro-thumbnail.svg"
            alt="Video introduction for Tomorrow University of Applied Sciences"
            width={1280}
            height={720}
            priority
            className="aspect-video h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/25"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-black/50 text-white shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-8 w-8 sm:h-10 sm:w-10">
                <path d="M8 5.14v13.72a.75.75 0 0 0 1.13.65l10.8-6.86a.76.76 0 0 0 0-1.3L9.13 4.49A.75.75 0 0 0 8 5.14Z" />
              </svg>
            </span>
          </span>
        </Button>
      </section>
      </SectionLayout>

      {isVideoOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setIsVideoOpen(false)}
        >
          <SectionLayout
            width="standard"
            className="overflow-hidden rounded-2xl border border-white/15 bg-gray-950 shadow-2xl"
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="intro-video-title"
              className="w-full"
              onClick={(event) => event.stopPropagation()}
            >
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <Heading
                as="h2"
                size="inherit"
                color="white"
                weight="semibold"
                id="intro-video-title"
              >
                Introduction
              </Heading>
              <Button
                variant="icon"
                size="large"
                onClick={() => setIsVideoOpen(false)}
                ariaLabel="Close introduction video"
              >
                &times;
              </Button>
            </div>
            <video
              autoPlay
              controls
              playsInline
              className="block max-h-[75vh] w-full bg-black"
              src={INTRO_VIDEO_URL}
            >
              Your browser does not support embedded videos.
            </video>
            </section>
          </SectionLayout>
        </div>
      )}
    </main>
  )
}
