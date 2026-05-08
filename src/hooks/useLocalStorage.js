import { useState, useCallback } from 'react';
import { getItem, setItem } from '@/utils/cache';

/**
 * Persistent state hook backed by localStorage.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => getItem(key, initialValue));

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    setItem(key, valueToStore);
  }, [key, storedValue]);

  return [storedValue, setValue];
}
