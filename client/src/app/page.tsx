import Header from '@/components/header';
import Hero from '@/components/hero';
import BackgroundGradient from '@/components/backgroundGradient';

export default function Home() {
  return (
    <main className="relative text-white overflow-x-hidden">
        <BackgroundGradient />
        <Header />
        <Hero />
    </main>
  );
}