import { useApiEntry } from './useApiEntry';

export const useAllData = () => {
  return useApiEntry('api/all');
};