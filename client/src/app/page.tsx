'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Hero from '@/components/hero';
import About from '@/components/about';
import Experience from '@/components/experience';
// import Services from '@/components/services';
// import Projects from '@/components/projects';
// import Contact from '@/components/contact';
import BackgroundGradient from '@/components/backgroundGradient';
import { ApiDataProvider } from '@/providers/ApiDataProvider';
import { API_CONFIG } from '@/lib/api-config';

const endpoints = [
  API_CONFIG.endpoints.hero,
  API_CONFIG.endpoints.about,
  API_CONFIG.endpoints.experience,
]

export default function Home() {
  return (
    <ApiDataProvider endpoints={endpoints}>
      <main className="relative text-white overflow-x-hidden">
        <BackgroundGradient />
        <Header />
        <Hero />
        <About />
        <Experience />
        {/* <Services />
        <Projects />
        <Contact /> */}
        <Footer />
      </main>
    </ApiDataProvider>
  );
}