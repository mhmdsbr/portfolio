import useSWR from 'swr';
import { getApiBaseUrl, DEFAULT_SWR_OPTIONS } from '@/lib/api-config';
import { EndpointMap } from '@/types/apiTypes';

const useApiFetcher = <T extends keyof EndpointMap>(endpoints: T[]) => {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
  }

  const { data, error, isLoading } = useSWR(
    endpoints,
    async (endpoints) => {
      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          const sanitizedEndpoint = endpoint.replace(/[^a-zA-Z0-9-_/]/g, '');
          const url = `${apiBaseUrl}/${sanitizedEndpoint}`;

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}`);
          }
          return response.json() as Promise<EndpointMap[typeof endpoint]>;
        })
      );

      return endpoints.reduce((acc, endpoint, index) => {
        acc[endpoint] = results[index];
        return acc;
      }, {} as { [K in T]: EndpointMap[K] });
    },
    DEFAULT_SWR_OPTIONS
  );

  return {
    data: data || ({} as { [K in T]: EndpointMap[K] }),
    isLoading,
    error
  };
};

export default useApiFetcher;