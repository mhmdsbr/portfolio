import Header from '@/components/header';
import BackgroundGradient from '@/components/backgroundGradient';
import Hero from '@/components/hero';
import About from '@/components/about';
import Services from '@/components/services';
import Experience from '@/components/experience';
import Projects from '@/components/projects';
import Testimonials from '@/components/testimonials';
import Contact from '@/components/contact';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="relative text-white overflow-x-hidden">
        <BackgroundGradient />
        <Header />
        <Hero />
        <About />
        <Services />
        <Experience />
        <Projects />
        <Testimonials />
        <Contact />
        <Footer />
    </main>
  );
}