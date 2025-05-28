'use client';

import { useContext } from 'react';
import { ApiDataContext } from '@/providers/ApiDataProvider';
import { API_CONFIG } from '@/lib/api-config';

export const useHeroData = () => {
  const context = useContext(ApiDataContext);

  if (!context) {
    throw new Error('useHeroData must be used within an ApiDataProvider');
  }

  return {
    hero: context.data[API_CONFIG.endpoints.hero],
    isLoading: context.isLoading,
    error: context.error
  };
};