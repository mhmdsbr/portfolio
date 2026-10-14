import { Fragment, type ReactNode } from "react";
import Header from "@/client/components/public/header";
import Footer from "@/client/components/public/footer/footer";
import Hero from "@/client/components/public/hero/hero";
import About from "@/client/components/public/about";
import Experience from "@/client/components/public/experience";
import Skills from "@/client/components/public/skills";
import Services from "@/client/components/public/services";
import Projects from "@/client/components/public/projects/projects";
import Contact from "@/client/components/public/contact";
import BackgroundGradient from "@/client/components/common/backgroundGradient";
import Testimonials from "@/client/components/public/testimonials/testimonials";
import { getPublicAll } from "@/server/services/public-content";
import type { SectionKind } from "@/shared/types";
import type { AllDataResponse } from "@/shared/types/public-content";

export const dynamic = "force-dynamic";

const sectionRenderers: Record<SectionKind, (data: AllDataResponse) => ReactNode> = {
  hero: (data) => <Hero hero={data.hero} />,
  about: (data) => <About about={data.about} />,
  experience: (data) => (
    <>
      <Experience experience={data.experience} />
      <Skills skills={data.experience.skills} />
    </>
  ),
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
