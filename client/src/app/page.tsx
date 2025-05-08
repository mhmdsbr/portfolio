import Header from '@/components/header';
import BackgroundGradient from '@/components/backgroundGradient';
import Hero from '@/components/hero';
import About from '@/components/about';
import Services from '@/components/services';
import Experience from '@/components/experience';
import Projects from '@/components/projects';
import Testimonials from '@/components/testimonials';

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
        <div>
          <p>
            Results-driven JavaScript, React, TypeScript, Next.js, and WordPress developer with over five years of experience leading and implementing projects of varying scales.
            Results-driven JavaScript, React, TypeScript, Next.js, and WordPress developer with over five years of experience leading and implementing projects of varying scales.
            Successfully led, developed and delivered 30+ projects using React and WordPress. Possesses an in-depth understanding of Javascript, React.js, and the WordPress CMS. Recognized for critical thinking, problem-solving, and an Agile mindset.
          </p>
          <p>
            Results-driven JavaScript, React, TypeScript, Next.js, and WordPress developer with over five years of experience leading and implementing projects of varying scales.
            Results-driven JavaScript, React, TypeScript, Next.js, and WordPress developer with over five years of experience leading and implementing projects of varying scales.
            Successfully led, developed and delivered 30+ projects using React and WordPress. Possesses an in-depth understanding of Javascript, React.js, and the WordPress CMS. Recognized for critical thinking, problem-solving, and an Agile mindset.
          </p>
        </div>
    </main>
  );
}