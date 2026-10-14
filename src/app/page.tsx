import { Fragment, type ReactNode } from "react";
import Header from "@/client/components/public/organisms/header";
import Footer from "@/client/components/public/organisms/footer";
import Hero from "@/client/components/public/organisms/hero";
import About from "@/client/components/public/organisms/about";
import Experience from "@/client/components/public/organisms/experience";
import Services from "@/client/components/public/organisms/services";
import Projects from "@/client/components/public/organisms/projects";
import Contact from "@/client/components/public/organisms/contact";
import Skills from "@/client/components/public/organisms/skills";
import BackgroundGradient from "@/client/components/common/backgroundGradient";
import PublicPageLayout from "@/client/components/public/layouts/PublicPageLayout";
import Testimonials from "@/client/components/public/organisms/testimonials";
import { getPublicAll } from "@/server/services/public-content";
import type { SectionKind } from "@/shared/types";
import type { AllDataResponse } from "@/shared/types/public-content";

export const dynamic = "force-dynamic";

const sectionRenderers: Record<SectionKind, (data: AllDataResponse) => ReactNode> = {
  hero: (data) => <Hero hero={data.hero} details={data.about.details} />,
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
    <PublicPageLayout id="main">
      <BackgroundGradient />
      <Header headerData={data.header} />
      {sections.map((section) => {
        const render = sectionRenderers[section.kind];
        return render ? <Fragment key={section.kind}>{render(data)}</Fragment> : null;
      })}
      <Footer footerData={data.footer} />
    </PublicPageLayout>
  );
}
