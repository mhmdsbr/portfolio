'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Hero from '@/components/hero';
import About from '@/components/about'
import Services from '@/components/services'
import Experience from '@/components/experience'
import { HeroDataProvider } from '@/providers/HeroDataProvider';

export default function Home() {
  return (
    <HeroDataProvider>
      <main className="relative text-white overflow-x-hidden">
        <Header />
        <Hero />
        <About />
        <Services />
        <Experience />
        <Footer />
      </main>
    </HeroDataProvider>
  );
}