// =============================================
// Response Types for New API
// =============================================

export interface Button {
  text: string | null;
  url: string | null;
}

export interface SocialMediaMap {
  [key: string]: string;
}

export interface SidebarResponse {
  profile_image: string | null;
  profile_image_alt: string | null;
  profile_title: string | null;
  social_media: SocialMediaMap;
  portfolio_title: string | null;
  portfolio_overlay_title: string | null;
}

export interface HeroResponse {
  titles: string[];
  location: string | null;
  subtitle_one: string | null;
  subtitle_two: string | null;
  logo: string | null;
}

export interface AboutResponse {
  title: string | null;
  overlay_title: string | null;
  name: string | null;
  job_title: string | null;
  description: string | null;
  button: Button;
  contact_information: Array<{
    title: string;
    content: string;
  }>;
  details: Array<{
    number: number;
    title: string;
  }>;
}

export interface ServicesResponse {
  title: string | null;
  overlay_title: string | null;
  items: Array<{
    title: string;
    content: string | null;
    icon: string | null;
  }>;
}

export interface SummaryResponse {
  title: string | null;
  overlay_title: string | null;
  button: Button;
  jobs: Array<{
    from: number | null;
    to: string | null;
    title: string;
    company: string;
    description: string | null;
  }>;
  experiences: Array<{
    skill: string;
    level: number | null;
  }>;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  tech?: string[];
}

export interface ProjectsResponse {
  title: string | null;
  overlay_title: string | null;
  items: Project[];
}

export interface TestimonialsResponse {
  title: string | null;
  overlay_title: string | null;
  items: Array<{
    image: string | null;
    title: string;
    subtitle: string | null;
    rating: string | null;
    content: string | null;
  }>;
}

export interface ContactResponse {
  title: string | null;
  overlay_title: string | null;
  form_title: string | null;
  button: Button;
  info_title: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
}

export interface ConfigResponse {
  api_base_url: string | null;
  smtp: {
    host: string | null;
    port: string | null;
    username: string | null;
    password: string | null;
  };
  recaptcha_site_key: string | null;
}

export interface HeaderSection {
  id: number
  sectionId: string // hero, about, experience, etc.
  title: string
  sortOrder: number
}

export interface HeaderResponse {
  sections: HeaderSection[]
  defaultTitle: string
}

export interface FooterResponse {
  companyName: string
  privacyPolicy: string | null
  termsOfService: string | null
  copyrightText: string | null
}

// =============================================
// Combined Response
// =============================================

export interface AllDataResponse {
  sidebar: SidebarResponse;
  hero: HeroResponse;
  about: AboutResponse;
  services: ServicesResponse;
  summary: SummaryResponse;
  testimonials: TestimonialsResponse;
  projects: ProjectsResponse;
  contact: ContactResponse;
  config: ConfigResponse;
  header: HeaderResponse
  footer: FooterResponse
}

// =============================================
// API Response Wrapper
// =============================================

export interface ApiResponseWrapper<T = any> {
  data: T;
  timestamp?: string;
  error?: string;
}

// =============================================
// Endpoint Map for Type Safety
// =============================================

export interface EndpointMap {
  'api/sidebar': ApiResponseWrapper<SidebarResponse>;
  'api/hero': ApiResponseWrapper<HeroResponse>;
  'api/about': ApiResponseWrapper<AboutResponse>;
  'api/services': ApiResponseWrapper<ServicesResponse>;
  'api/summary': ApiResponseWrapper<SummaryResponse>;
  'api/testimonials': ApiResponseWrapper<TestimonialsResponse>;
  'api/contact': ApiResponseWrapper<ContactResponse>;
  'api/footer': ApiResponseWrapper<FooterResponse>;
  'api/config': ApiResponseWrapper<ConfigResponse>;
  'api/all': ApiResponseWrapper<AllDataResponse>;
}

export type EndpointKeys = keyof EndpointMap;