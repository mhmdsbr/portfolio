import { useContext } from 'react';
import { ApiDataContext } from '@/providers/ApiDataProvider';
import { EndpointMap, EndpointKeys } from '@/types/api';

export const useApiEntry = <T extends EndpointKeys>(endpoint: T) => {
  const context = useContext(ApiDataContext);

  if (!context) {
    throw new Error('useApiEntry must be used within an ApiDataProvider');
  }

  // Extract data from the wrapper
  const rawData = context.data[endpoint];
  const data = rawData?.data as EndpointMap[T]['data'] | undefined;

  return {
    data: data || null,
    isLoading: context.isLoading,
    error: context.error,
    mutate: context.mutate,
  };
};