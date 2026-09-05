import { useApiEntry } from './useApiEntry'
import type { AllDataResponse } from '@/types/api'

export const useAllData = () => {
  const { data, isLoading, error, mutate } = useApiEntry('api/all')
  
  // ✅ Return mutate function for manual updates
  return {
    data: data as AllDataResponse | null,
    isLoading,
    error,
    mutate, // <- This allows us to update cache instantly
  }
}