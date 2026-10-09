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

export interface HeroResponse {
  titles: string[];
  location: string | null;
  subtitle_one: string | null;
  subtitle_two: string | null;
  logo: string | null;
}

export interface AboutResponse {
  title: string | null;
  name: string | null;
  job_title: string | null;
  description: string | null;
  button: Button;
  contact_information: Array<{
    kind: 'email' | 'phone' | 'address' | 'other';
    title: string;
    value: string;
  }>;
  details: Array<{
    number: number;
    title: string;
  }>;
}

export interface ServicesResponse {
  title: string | null;
  items: Array<{
    title: string;
    description: string | null;
    icon: string | null;
  }>;
}

export interface SummaryResponse {
  title: string | null;
  button: Button;
  jobs: Array<{
    from: number | null;
    to: number | null;
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
  description: string | null;
  image: string | null;
  link: string | null;
  github_url: string | null;
  roles: string[] | null;
  tech: string[] | null;
}

export interface ProjectsResponse {
  title: string | null;
  items: Project[];
}

export interface TestimonialsResponse {
  title: string | null;
  items: Array<{
    image: string | null;
    title: string;
    subtitle: string | null;
    rating: number | null;
    body: string | null;
  }>;
}

export interface ContactResponse {
  title: string | null;
  form_title: string | null;
  button: Button;
  methods: Array<{
    id: number;
    kind: 'email' | 'phone' | 'address' | 'other';
    title: string;
    value: string;
  }>;
}

export interface ConfigResponse {
  recaptcha_site_key: string | null;
}

export interface PageSection {
  id: number;
  sectionKey: string;
  navigationTitle: string;
  title: string | null;
  sortOrder: number | null;
  isEnabled: boolean;
}

export interface HeaderResponse {
  sections: PageSection[];
  defaultTitle: string | null;
}

export interface FooterResponse {
  companyName: string | null;
  privacyPolicy: string | null;
  termsOfService: string | null;
  copyrightText: string | null;
}

// =============================================
// Combined Response
// =============================================

export interface AllDataResponse {
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

export interface ApiResponseWrapper<T = unknown> {
  data?: T;
  timestamp?: string;
  error?: string;
}

export type ApiResponse<T> = ApiResponseWrapper<T>;

// =============================================
// Endpoint Map for Type Safety
// =============================================

export interface EndpointMap {
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
