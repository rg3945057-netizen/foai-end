/**
 * Set a value in localStorage with an expiry timestamp.
 */
export function setCacheItem(key, data, ttlMs) {
  const payload = {
    data,
    expiry: Date.now() + ttlMs,
  };
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

/**
 * Get a cached value. Returns null if missing or expired.
 */
export function getCacheItem(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (Date.now() > payload.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return payload.data;
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
    return null;
  }
}

/**
 * Remove a cache entry.
 */
export function removeCacheItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('LocalStorage remove failed:', e);
  }
}

/**
 * Set a plain (non-expiring) item in localStorage.
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

/**
 * Get a plain item from localStorage.
 */
export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
    return fallback;
  }
}
