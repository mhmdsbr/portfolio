import { useContext } from 'react';
import { ApiDataContext } from '@/providers/ApiDataProvider';
import { EndpointMap } from '@/types/apiTypes';

export const useApiEntry = <T extends keyof EndpointMap>(endpoint: T) => {
  const context = useContext(ApiDataContext);

  if (!context) {
    throw new Error('useApiEntry must be used within an ApiDataProvider');
  }

  return {
    data: context.data[endpoint] as EndpointMap[T],
    isLoading: context.isLoading,
    error: context.error,
  };
};
