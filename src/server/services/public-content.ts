import { readSectionConfig } from '@/server/helpers/section-config'
import type { SectionKind } from '@/shared/types'
import { getContactMethodsWithSections } from '@/server/repos/contact-methods'
import { experienceRepo, profileFactRepo, serviceRepo, skillRepo, testimonialRepo } from '@/server/repos/collections'
import { listHeroTitles } from '@/server/repos/hero-titles'
import { listSections } from '@/server/repos/page-sections'
import { getProjects } from '@/server/repos/projects'
import { profileRepo, siteConfigRepo } from '@/server/repos/singletons'
import { listSocialLinks } from '@/server/repos/social-links'
import type {
  AboutResponse,
  AllDataResponse,
  ConfigResponse,
  ContactResponse,
  ExperienceResponse,
  FooterResponse,
  HeroResponse,
  HeaderResponse,
  ProjectsResponse,
  ServicesResponse,
  TestimonialsResponse,
} from '@/shared/types'

type Section = Awaited<ReturnType<typeof listSections>>[number]
type ContactMethods = Awaited<ReturnType<typeof getContactMethodsWithSections>>
type SiteConfig = Awaited<ReturnType<typeof siteConfigRepo.get>>

export async function getPublicHeader(): Promise<HeaderResponse> {
  return mapHeader(await listSections())
}

function mapHeader(sections: Section[]): HeaderResponse {
  return {
    sections: sections.map(({ id, kind, navigationTitle, title, sortOrder, isEnabled }) => ({
      id,
      kind,
      navigationTitle,
      title,
      sortOrder,
      isEnabled,
    })),
    defaultTitle: null,
  }
}

function mapHero(
  section: Section | null | undefined,
  titles: Awaited<ReturnType<typeof listHeroTitles>>,
): HeroResponse {
  const config = readSectionConfig('hero', section?.config)
  return {
    titles: titles.map(({ title }) => title),
    location: config.location,
    subtitle_one: config.subtitleOne,
    subtitle_two: config.subtitleTwo,
    logo: config.logoUrl,
  }
}

function mapAbout(
  section: Section | null | undefined,
  profile: Awaited<ReturnType<typeof profileRepo.get>>,
  methods: ContactMethods,
  details: Awaited<ReturnType<typeof profileFactRepo.list>>,
): AboutResponse {
  return {
    title: section?.title ?? null,
    name: profile?.name ?? null,
    job_title: profile?.jobTitle ?? null,
    description: profile?.biography ?? null,
    contact_information: methods.map(({ kind, title, value }) => ({ kind, title, value })),
    details: details.map(({ number, title }) => ({ number, title })),
  }
}

function mapExperience(
  section: Section | null | undefined,
  experiences: Awaited<ReturnType<typeof experienceRepo.list>>,
  skills: Awaited<ReturnType<typeof skillRepo.list>>,
): ExperienceResponse {
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

function mapServices(
  section: Section | null | undefined,
  items: Awaited<ReturnType<typeof serviceRepo.list>>,
): ServicesResponse {
  return {
    title: section?.title ?? null,
    items: items.map(({ title, description, icon }) => ({
      title,
      description: description ?? null,
      icon: icon ?? null,
    })),
  }
}

function mapTestimonials(
  section: Section | null | undefined,
  items: Awaited<ReturnType<typeof testimonialRepo.list>>,
): TestimonialsResponse {
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

function mapProjects(
  section: Section | null | undefined,
  projects: Awaited<ReturnType<typeof getProjects>>,
): ProjectsResponse {
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

function mapContact(
  section: Section | null | undefined,
  methods: ContactMethods,
  socialLinks: Awaited<ReturnType<typeof listSocialLinks>>,
): ContactResponse {
  const config = readSectionConfig('contact', section?.config)
  return {
    title: section?.title ?? null,
    form_title: config.formTitle,
    button: {
      text: config.buttonText,
      url: config.buttonUrl,
    },
    methods: methods.map(({ id, kind, title, value }) => ({ id, kind, title, value })),
    socialLinks,
  }
}

function mapFooter(config: SiteConfig): FooterResponse {
  return {
    companyName: config?.companyName ?? null,
    privacyPolicy: config?.privacyPolicy ?? null,
    termsOfService: config?.termsOfService ?? null,
    copyrightText: config?.copyrightText ?? null,
  }
}

function mapConfig(config: SiteConfig): ConfigResponse {
  return { recaptcha_site_key: config?.recaptchaSiteKey ?? null }
}

export async function getPublicAll(): Promise<AllDataResponse> {
  const sectionsPromise = listSections()
  const titlesPromise = sectionsPromise.then((sections) => {
    const hero = sections.find((section) => section.kind === 'hero')
    return hero ? listHeroTitles(hero.id) : []
  })
  const [
    sections, methods, settings, profile, details, experiences,
    skills, services, testimonials, projects, socialLinks, titles,
  ] = await Promise.all([
    sectionsPromise,
    getContactMethodsWithSections(),
    siteConfigRepo.get(),
    profileRepo.get(),
    profileFactRepo.list(),
    experienceRepo.list(),
    skillRepo.list(),
    serviceRepo.list(),
    testimonialRepo.list(),
    getProjects(),
    listSocialLinks(),
    titlesPromise,
  ])

  const sectionsByKind = new Map<SectionKind, (typeof sections)[number]>(
    sections.map((section) => [section.kind, section]),
  )
  const heroSection = sectionsByKind.get('hero')
  const contactMethodsFor = (kind: 'about' | 'contact') =>
    methods.filter((method) => method.sections.includes(kind))
  const footer = mapFooter(settings)

  return {
    hero: mapHero(heroSection, titles),
    about: mapAbout(
      sectionsByKind.get('about'), profile, contactMethodsFor('about'), details,
    ),
    services: mapServices(sectionsByKind.get('services'), services),
    experience: mapExperience(sectionsByKind.get('experience'), experiences, skills),
    testimonials: mapTestimonials(sectionsByKind.get('testimonials'), testimonials),
    projects: mapProjects(sectionsByKind.get('projects'), projects),
    contact: mapContact(
      sectionsByKind.get('contact'), contactMethodsFor('contact'), socialLinks,
    ),
    config: mapConfig(settings),
    header: mapHeader(sections),
    footer: {
      companyName: footer.companyName || 'Your Company',
      privacyPolicy: footer.privacyPolicy,
      termsOfService: footer.termsOfService,
      copyrightText: footer.copyrightText,
    },
  }
}
