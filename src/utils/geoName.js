import axios from 'axios';
import { NOMINATIM_API } from '@/constants';

let lastGeoFetch = 0;
const GEO_THROTTLE_MS = 30000; // only fetch geo every 30s to respect Nominatim limits

/**
 * Reverse geocode lat/lon to a human-readable place name.
 * Throttled to avoid overloading Nominatim.
 */
export async function getRegionName(lat, lon) {
  const now = Date.now();
  if (now - lastGeoFetch < GEO_THROTTLE_MS) return null;
  lastGeoFetch = now;

  try {
    const res = await axios.get(NOMINATIM_API, {
      params: {
        lat,
        lon,
        format: 'json',
        zoom: 3,
      },
      headers: {
        'Accept-Language': 'en',
      },
      timeout: 5000,
    });
    const addr = res.data?.address;
    if (!addr) return 'Open Ocean';
    return (
      addr.country ||
      addr.state ||
      addr.county ||
      addr.ocean ||
      addr.sea ||
      'Open Ocean'
    );
  } catch {
    return 'Unknown Region';
  }
}
