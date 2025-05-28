export const API_CONFIG = {
  endpoints: {
    hero: 'portfolio/v2/hero-portfolio',
  },
  defaultParams: {
    cache: 'force-cache',
    revalidate: 3600 // 1 hour
  }
} as const;

export type ApiEndpoint = keyof typeof API_CONFIG.endpoints;
export type ApiPath = typeof API_CONFIG.endpoints[ApiEndpoint];