"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Hero from "@/components/hero/hero";
import About from "@/components/about";
import Experience from "@/components/experience";
import Services from "@/components/services";
import Projects from "@/components/projects/projects";
import Contact from "@/components/contact";
import BackgroundGradient from "@/components/backgroundGradient";
import { ApiDataProvider } from "@/providers/ApiDataProvider";
import Testimonials from "@/components/testimonials/testimonials";


export default function Home() {
  return (
    <ApiDataProvider endpoints={["api/all"]}>
      <main id="main" className="relative text-white overflow-x-hidden">
        <BackgroundGradient />
        <Header />
        <Hero />
        <About />
        <Experience />
        <Services />
        <Projects />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </ApiDataProvider>
  );
}
