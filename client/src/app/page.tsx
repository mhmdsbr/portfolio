import Head from 'next/head';
import Header from '@/components/header';
import Hero from '@/components/hero';

export default function Home() {
  return (
    <div className="text-white h-screen overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-gray-400/20">
      <Head>
        <title>Mohammad Saber | Web developer | Portfolio</title>
        <meta name="description" content="Personal portfolio website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className=''>
        <Header />
      </section>

      <section id="hero" className="">
        <Hero />
      </section>

    </div>
  );
}