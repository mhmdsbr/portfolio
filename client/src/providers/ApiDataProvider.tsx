'use client';

import React, { createContext, useContext } from 'react';
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

  if (error) {
    return (
      <div className="data-error">
        <div className="alert alert-danger">
          {error.message}
          <button
            className="btn btn-link"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="data-spinner">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <ApiDataContext.Provider value={{ data, isLoading, error }}>
      {children}
    </ApiDataContext.Provider>
  );
};

export const useApiData = () => {
  const context = useContext(ApiDataContext);
  if (context === undefined) {
    throw new Error('useApiData must be used within an ApiDataProvider');
  }
  return context;
};