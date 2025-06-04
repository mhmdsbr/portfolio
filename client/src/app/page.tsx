'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Hero from '@/components/hero';
import { API_CONFIG } from '@/lib/api-config';
import { ApiDataProvider } from '@/providers/ApiDataProvider';

export default function Home() {
  return (
    <ApiDataProvider endpoints={[API_CONFIG.endpoints.hero]}>
      <main className="relative text-white overflow-x-hidden">
        <Header />
        <Hero />
        <Footer />
      </main>
    </ApiDataProvider>
  );
}