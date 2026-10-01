'use client'

import { useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'
import Image from 'next/image'
import Link from 'next/link'

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
      <section className="relative z-10 mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-gray-950/60 p-7 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:p-12 md:p-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-cyan-300"
        >
          <span aria-hidden="true">←</span>
          Back to home
        </Link>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Video introduction
        </p>
        <h1 className="text-xl font-bold sm:text-2xl md:text-4xl">
          Tomorrow University of Applied Sciences
        </h1>
        <button
          type="button"
          onClick={() => setIsVideoOpen(true)}
          aria-label="Play video introduction"
          className="group relative mt-9 block w-full cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-gray-900 text-left shadow-2xl shadow-cyan-950/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
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
        </button>
      </section>

      {isVideoOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setIsVideoOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="intro-video-title"
            className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-gray-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <h2 id="intro-video-title" className="font-semibold text-white">
                Introduction
              </h2>
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                aria-label="Close introduction video"
                className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-gray-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300"
              >
                &times;
              </button>
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
        </div>
      )}
    </main>
  )
}
