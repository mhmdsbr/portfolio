import { readSectionConfig } from '@/lib/db/section-config'
import type { SectionKind } from '@/lib/db/constants'
import { getContactMethodsForSection, getContactMethodsWithSections } from '@/server/repos/contact-methods'
import { experienceRepo, profileFactRepo, serviceRepo, skillRepo, testimonialRepo } from '@/server/repos/collections'
import { listHeroTitles } from '@/server/repos/hero-titles'
import { listSections, getSection } from '@/server/repos/page-sections'
import { getProjects } from '@/server/repos/projects'
import { profileRepo, siteConfigRepo } from '@/server/repos/singletons'
import type {
  AboutResponse,
  AllDataResponse,
  ConfigResponse,
  ContactResponse,
  ExperienceResponse,
  FooterResponse,
  HeroResponse,
  ProjectsResponse,
  ServicesResponse,
  TestimonialsResponse,
} from '@/types/api'

export async function getPublicHero(): Promise<HeroResponse> {
  const section = await getSection('hero')
  const titles = section ? await listHeroTitles(section.id) : []

  return {
    titles: titles.map(({ title }) => title),
    location: section?.config.location ?? null,
    subtitle_one: section?.config.subtitleOne ?? null,
    subtitle_two: section?.config.subtitleTwo ?? null,
    logo: section?.config.logoUrl ?? null,
  }
}

export async function getPublicAbout(): Promise<AboutResponse> {
  const [section, profile, methods, details] = await Promise.all([
    getSection('about'),
    profileRepo.get(),
    getContactMethodsForSection('about'),
    profileFactRepo.list(),
  ])

  return {
    title: section?.title ?? null,
    name: profile?.name ?? null,
    job_title: profile?.jobTitle ?? null,
    description: profile?.biography ?? null,
    contact_information: methods.map(({ kind, title, value }) => ({ kind, title, value })),
    details: details.map(({ number, title }) => ({ number, title })),
  }
}

export async function getPublicExperience(): Promise<ExperienceResponse> {
  const [section, experiences, skills] = await Promise.all([
    getSection('experience'),
    experienceRepo.list(),
    skillRepo.list(),
  ])

  return {
    title: section?.title ?? null,
    experiences: experiences.map((experience) => ({
      from: experience.fromYear ?? null,
      to: experience.toYear,
      title: experience.jobTitle,
      company: experience.company,
      description: experience.description ?? null,
    })),
    skills: skills.map(({ skill, level }) => ({ skill, level: level ?? null })),
  }
}

export async function getPublicServices(): Promise<ServicesResponse> {
  const [section, items] = await Promise.all([
    getSection('services'),
    serviceRepo.list(),
  ])

  return {
    title: section?.title ?? null,
    items: items.map(({ title, description, icon }) => ({
      title,
      description: description ?? null,
      icon: icon ?? null,
    })),
  }
}

export async function getPublicTestimonials(): Promise<TestimonialsResponse> {
  const [section, items] = await Promise.all([
    getSection('testimonials'),
    testimonialRepo.list(),
  ])

  return {
    title: section?.title ?? null,
    items: items.map(({ imageUrl, title, subtitle, rating, body }) => ({
      image: imageUrl ?? null,
      title,
      subtitle: subtitle ?? null,
      rating: rating ?? null,
      body: body ?? null,
    })),
  }
}

export async function getPublicProjects(): Promise<ProjectsResponse> {
  const [section, projects] = await Promise.all([
    getSection('projects'),
    getProjects(),
  ])

  return {
    title: section?.title ?? null,
    items: projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      category: project.category,
      category_slug: project.categorySlug,
      description: project.description ?? null,
      image: project.image ?? null,
      link: project.link ?? null,
      github_url: project.githubUrl ?? null,
      tech: project.tech.length > 0 ? project.tech : null,
      roles: project.roles.length > 0 ? project.roles : null,
    })),
  }
}

export async function getPublicContact(): Promise<ContactResponse> {
  const [section, methods] = await Promise.all([
    getSection('contact'),
    getContactMethodsForSection('contact'),
  ])

  return {
    title: section?.title ?? null,
    form_title: section?.config.formTitle ?? null,
    button: {
      text: section?.config.buttonText ?? null,
      url: section?.config.buttonUrl ?? null,
    },
    methods: methods.map(({ id, kind, title, value }) => ({ id, kind, title, value })),
  }
}

export async function getPublicFooter(): Promise<FooterResponse> {
  const config = await siteConfigRepo.get()
  return {
    companyName: config?.companyName ?? null,
    privacyPolicy: config?.privacyPolicy ?? null,
    termsOfService: config?.termsOfService ?? null,
    copyrightText: config?.copyrightText ?? null,
  }
}

export async function getPublicConfig(): Promise<ConfigResponse> {
  const config = await siteConfigRepo.get()
  return { recaptcha_site_key: config?.recaptchaSiteKey ?? null }
}

export async function getPublicAll(): Promise<AllDataResponse> {
  const [hero, about, services, experience, testimonials, projects, contact, config, footer, sections] =
    await Promise.all([
      getPublicHero(),
      getPublicAbout(),
      getPublicServices(),
      getPublicExperience(),
      getPublicTestimonials(),
      getPublicProjects(),
      getPublicContact(),
      getPublicConfig(),
      getPublicFooter(),
      listSections(),
    ])

  const sectionsByKind = new Map<SectionKind, (typeof sections)[number]>(
    sections.map((section) => [section.kind, section]),
  )
  const sectionConfig = <K extends SectionKind>(kind: K) =>
    readSectionConfig(kind, sectionsByKind.get(kind)?.config)
  const allContactMethods = await getContactMethodsWithSections()
  const contactMethodsFor = (kind: 'about' | 'contact') =>
    allContactMethods.filter((method) => method.sections.includes(kind))

  return {
    hero,
    about: {
      ...about,
      contact_information: contactMethodsFor('about').map(({ kind, title, value }) => ({
        kind,
        title,
        value,
      })),
    },
    services,
    experience,
    testimonials,
    projects,
    contact: {
      ...contact,
      title: sectionsByKind.get('contact')?.title ?? null,
      form_title: sectionConfig('contact').formTitle,
      button: {
        text: sectionConfig('contact').buttonText,
        url: sectionConfig('contact').buttonUrl,
      },
      methods: contactMethodsFor('contact').map(({ id, kind, title, value }) => ({
        id,
        kind,
        title,
        value,
      })),
    },
    config,
    header: {
      sections: sections.map(({ id, kind, navigationTitle, title, sortOrder, isEnabled }) => ({
        id,
        kind,
        navigationTitle,
        title,
        sortOrder,
        isEnabled,
      })),
      defaultTitle: null,
    },
    footer: {
      companyName: footer.companyName || 'Your Company',
      privacyPolicy: footer.privacyPolicy,
      termsOfService: footer.termsOfService,
      copyrightText: footer.copyrightText,
    },
  }
}
