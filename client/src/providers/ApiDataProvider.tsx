'use client';

import React, { createContext } from 'react';
import useApiFetcher from '@/hooks/useApiFetcher';
import { EndpointMap } from '@/types/apiTypes';

type ApiDataContextType = {
  data: Partial<EndpointMap>;
  isLoading: boolean;
  error: Error | null;
};

export const ApiDataContext = createContext<ApiDataContextType | undefined>(undefined);

export const ApiDataProvider = <T extends keyof EndpointMap>({
  endpoints,
  children,
}: {
  endpoints: T[];
  children: React.ReactNode;
}) => {
  const { data, isLoading, error } = useApiFetcher<T>(endpoints);

  return (
    <ApiDataContext.Provider value={{ data, isLoading, error }}>
      {children}
    </ApiDataContext.Provider>
  );
};
