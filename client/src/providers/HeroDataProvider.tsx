'use client';

import { ReactNode } from 'react';
import { ApiDataProvider } from '@/providers/ApiDataProvider';
import { API_CONFIG } from '@/lib/api-config';

export const HeroDataProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ApiDataProvider endpoints={[API_CONFIG.endpoints.hero]}>
      {children}
    </ApiDataProvider>
  );
};