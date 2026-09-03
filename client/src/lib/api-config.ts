export const getApiBaseUrl = () => {
  // Use relative URL for Next.js API routes
  const url = process.env.NEXT_PUBLIC_API_URL || '';
  return url;
};

export const API_CONFIG = {
  endpoints: {
    // New Next.js API endpoints
    sidebar: 'api/sidebar',
    hero: 'api/hero',
    about: 'api/about',
    services: 'api/services',
    summary: 'api/summary',
    testimonials: 'api/testimonials',
    contact: 'api/contact',
    footer: 'api/footer',
    config: 'api/config',
    all: 'api/all', // Optional: fetch all data at once
  },
  defaultParams: {
    cache: 'force-cache',
    revalidate: 3600,
  },
} as const;

export const DEFAULT_SWR_OPTIONS = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 1 minute
};