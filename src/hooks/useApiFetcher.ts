import useSWR from 'swr';
import { getApiBaseUrl, DEFAULT_SWR_OPTIONS } from '@/lib/api-config';
import { EndpointMap, EndpointKeys } from '@/types/api';

const useApiFetcher = <T extends EndpointKeys>(endpoints: T[]) => {
  const apiBaseUrl = getApiBaseUrl();

  const { data, error, isLoading, mutate } = useSWR(
    endpoints,
    async (endpoints) => {
      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          // Build URL - if apiBaseUrl is empty, use relative path
          const url = apiBaseUrl ? `${apiBaseUrl}/${endpoint}` : `/${endpoint}`;

          const response = await fetch(url);

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${errorText}`);
          }

          const json = await response.json();
          return json as EndpointMap[T];
        })
      );

      return endpoints.reduce((acc, endpoint, index) => {
        acc[endpoint] = results[index];
        return acc;
      }, {} as { [K in T]: EndpointMap[K] });
    },
    {
      ...DEFAULT_SWR_OPTIONS,
      // Custom fetcher key to avoid re-fetching
      revalidateIfStale: false,
    }
  );

  return {
    data: data || ({} as { [K in T]: EndpointMap[K] }),
    isLoading,
    error,
    mutate,
  };
};

export default useApiFetcher;