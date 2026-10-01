import Link from 'next/link'
import BackgroundGradient from '@/components/backgroundGradient'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16 text-white sm:px-8">
      <BackgroundGradient />
      <section className="relative z-10 mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-gray-950/70 p-8 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          404 — Page not found
        </p>
        <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
          This page isn&apos;t here.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-gray-300 sm:text-lg">
          The link may be incorrect, or the page may have been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-400 px-6 py-3 font-semibold text-gray-950 transition hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
        >
          Back to home
        </Link>
      </section>
    </main>
  )
}
