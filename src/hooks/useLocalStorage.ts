/**
 * localStorage hook with SSR safety.
 * Reads/writes values to localStorage with JSON serialization.
 * Falls back to the default value during SSR or when localStorage is unavailable.
 */

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  /* Hydrate from localStorage on mount (client-side only) */
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      /* localStorage unavailable or parse error — use default */
    }
  }, [key]);

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* Quota exceeded or unavailable — fail silently */
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
