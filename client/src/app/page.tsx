import Head from 'next/head'
import Header from '@/components/header'
import Hero from '@/components/hero'
import BackgroundCanvas from '@/components/3d-background'

export default function Home() {
  return (
    <div className="text-white overflow-x-hidden relative">
      <Head>
        <title>Mohammad Saber | Web developer | Portfolio</title>
        <meta name="description" content="Personal portfolio website" />
      </Head>

      <BackgroundCanvas />

      <div className="relative z-10">
        <Header />
        <Hero />
        <Hero />
        {/* Add more sections as needed */}
      </div>
    </div>
  )
}