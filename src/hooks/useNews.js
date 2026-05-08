import { useNewsContext } from '@/context/NewsContext';

/**
 * Convenience hook to access news data from context.
 */
export function useNews() {
  return useNewsContext();
}
