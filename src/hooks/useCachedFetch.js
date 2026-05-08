import { useState, useCallback, useRef } from 'react';
import { getCacheItem, setCacheItem } from '@/utils/cache';

/**
 * Fetch hook with localStorage caching and TTL.
 * @param {string} cacheKey
 * @param {Function} fetcher - async function returning data
 * @param {number} ttlMs - cache TTL in milliseconds
 */
export function useCachedFetch(cacheKey, fetcher, ttlMs) {
  const [data, setData] = useState(() => getCacheItem(cacheKey));
  const [loading, setLoading] = useState(!getCacheItem(cacheKey));
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const execute = useCallback(async ({ force = false } = {}) => {
    if (!force) {
      const cached = getCacheItem(cacheKey);
      if (cached) {
        setData(cached);
        setLoading(false);
        return cached;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setCacheItem(cacheKey, result, ttlMs);
      return result;
    } catch (err) {
      setError(err.message || 'Fetch failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetcher, ttlMs]);

  return { data, loading, error, execute, setData };
}
