import { Fragment, type ReactNode } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer/footer";
import Hero from "@/components/hero/hero";
import About from "@/components/about";
import Experience from "@/components/experience";
import Services from "@/components/services";
import Projects from "@/components/projects/projects";
import Contact from "@/components/contact";
import BackgroundGradient from "@/components/backgroundGradient";
import Testimonials from "@/components/testimonials/testimonials";
import { getPublicAll } from "@/server/services/public-content";
import type { SectionKind } from "@/shared/constants";
import type { AllDataResponse } from "@/types/api";

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
