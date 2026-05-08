import axios from 'axios';

// Use Vite proxy in dev to avoid CORS/mixed-content issues
// Proxy paths are defined in vite.config.js
const ISS_NOW  = '/api/iss-now';
const ASTROS   = '/api/astros';
const GEO_REVERSE = '/api/geo/reverse';

/**
 * Fetch current ISS position.
 * Returns { latitude, longitude, timestamp }
 */
export async function fetchISSPosition() {
  const res  = await axios.get(ISS_NOW, { timeout: 8000 });
  const data = res.data;
  if (data.message !== 'success') throw new Error('ISS API error');
  return {
    latitude:  parseFloat(data.iss_position.latitude),
    longitude: parseFloat(data.iss_position.longitude),
    timestamp: data.timestamp, // Unix seconds
  };
}

/**
 * Fetch people currently in space.
 * Returns { number, people: [{ name, craft }] }
 */
export async function fetchAstronauts() {
  const res  = await axios.get(ASTROS, { timeout: 8000 });
  const data = res.data;
  if (data.message !== 'success') throw new Error('Astronauts API error');
  return { number: data.number, people: data.people };
}

/**
 * Reverse geocode lat/lon → place name via Nominatim proxy.
 * No User-Agent header — browsers forbid setting it.
 */
export async function fetchGeoName(lat, lon) {
  try {
    const res = await axios.get(GEO_REVERSE, {
      params:  { lat, lon, format: 'json' },
      timeout: 6000,
    });
    const addr = res.data?.address || {};
    return (
      addr.city     ||
      addr.town     ||
      addr.village  ||
      addr.county   ||
      addr.state    ||
      addr.country  ||
      res.data?.display_name?.split(',')[0] ||
      'Ocean / Remote Area'
    );
  } catch {
    return 'Ocean / Remote Area';
  }
}
