import { Fragment, type ReactNode } from "react";
import Header from "@/components/public/header";
import Footer from "@/components/public/footer/footer";
import Hero from "@/components/public/hero/hero";
import About from "@/components/public/about";
import Experience from "@/components/public/experience";
import Services from "@/components/public/services";
import Projects from "@/components/public/projects/projects";
import Contact from "@/components/public/contact";
import BackgroundGradient from "@/components/shared/backgroundGradient";
import Testimonials from "@/components/public/testimonials/testimonials";
import { getPublicAll } from "@/server/services/public-content";
import type { SectionKind } from "@/shared/types";
import type { AllDataResponse } from "@/shared/types/public-content";

export const dynamic = "force-dynamic";

const sectionRenderers: Record<SectionKind, (data: AllDataResponse) => ReactNode> = {
  hero: (data) => <Hero hero={data.hero} />,
  about: (data) => <About about={data.about} />,
  experience: (data) => <Experience experience={data.experience} />,
  services: (data) => <Services services={data.services} />,
  projects: (data) => <Projects projectsData={data.projects} />,
  testimonials: (data) => <Testimonials testimonialsData={data.testimonials} />,
  contact: (data) => <Contact contact={data.contact} />,
};

export default async function Home() {
  const data = await getPublicAll();
  const sections = data.header.sections.filter((section) => section.isEnabled);

  return (
    <main id="main" className="relative text-white overflow-x-hidden">
      <BackgroundGradient />
      <Header headerData={data.header} />
      {sections.map((section) => {
        const render = sectionRenderers[section.kind];
        return render ? <Fragment key={section.kind}>{render(data)}</Fragment> : null;
      })}
      <Footer footerData={data.footer} />
    </main>
  );
}
