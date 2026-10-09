"use client";

import Header from "@/components/header";
import Footer from "@/components/footer/footer";
import Hero from "@/components/hero/hero";
import About from "@/components/about";
import Experience from "@/components/experience";
import Services from "@/components/services";
import Projects from "@/components/projects/projects";
import Contact from "@/components/contact";
import BackgroundGradient from "@/components/backgroundGradient";
import { ApiDataProvider } from "@/providers/ApiDataProvider";
import Testimonials from "@/components/testimonials/testimonials";
import { useAllData } from "@/hooks/useAllData";
import type { ComponentType } from "react";

const sectionComponents: Record<string, ComponentType> = {
  hero: Hero,
  about: About,
  experience: Experience,
  services: Services,
  projects: Projects,
  testimonials: Testimonials,
  contact: Contact,
};

function ConfiguredSections() {
  const { data } = useAllData();
  const sections = data?.header.sections.filter((section) => section.isEnabled) ?? [];

  return sections.map((section) => {
    const Section = sectionComponents[section.sectionKey];
    return Section ? <Section key={section.sectionKey} /> : null;
  });
}

export default function Home() {
  return (
    <ApiDataProvider endpoints={["api/all"]}>
      <main id="main" className="relative text-white overflow-x-hidden">
        <BackgroundGradient />
        <Header />
        <ConfiguredSections />
        <Footer />
      </main>
    </ApiDataProvider>
  );
}
