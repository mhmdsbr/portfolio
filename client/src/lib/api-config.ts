export const getApiBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set");
  return url;
};

export const API_CONFIG = {
  endpoints: {
    hero: 'portfolio/v2/hero-portfolio',
  },
  defaultParams: {
    cache: 'force-cache',
    revalidate: 3600
  }
} as const;

export const DEFAULT_SWR_OPTIONS = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
};
