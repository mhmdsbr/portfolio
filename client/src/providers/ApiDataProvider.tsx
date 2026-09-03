'use client';

import React, { createContext, useMemo } from 'react';
import useApiFetcher from '@/hooks/useApiFetcher';
import { EndpointMap, EndpointKeys } from '@/types/api';

type ApiDataContextType = {
  data: Partial<EndpointMap>;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
};

export const ApiDataContext = createContext<ApiDataContextType | undefined>(undefined);

interface ApiDataProviderProps {
  endpoints: EndpointKeys[];
  children: React.ReactNode;
}

export const ApiDataProvider = ({ endpoints, children }: ApiDataProviderProps) => {
  const { data, isLoading, error, mutate } = useApiFetcher(endpoints);

  const value = useMemo(
    () => ({
      data,
      isLoading,
      error,
      mutate,
    }),
    [data, isLoading, error, mutate]
  );

  return (
    <ApiDataContext.Provider value={value}>
      {children}
    </ApiDataContext.Provider>
  );
};