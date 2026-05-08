/** Earth radius in km */
const R = 6371;
const toRad = (deg) => deg * (Math.PI / 180);

/**
 * Haversine distance between two lat/lon points.
 * @returns distance in km
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
}

/**
 * Calculate speed in km/h given two ISS positions.
 * @param {{ latitude, longitude, timestamp }} prev - Unix seconds timestamp
 * @param {{ latitude, longitude, timestamp }} curr - Unix seconds timestamp
 * @returns speed in km/h (rounded)
 */
export function calculateSpeed(prev, curr) {
  if (!prev || !curr) return 0;
  const timeDiffSeconds = curr.timestamp - prev.timestamp;
  if (timeDiffSeconds <= 0) return 0;

  const distance = haversineDistance(
    prev.latitude, prev.longitude,
    curr.latitude, curr.longitude,
  );

  // distance (km) / time (s) * 3600 = km/h
  const speedKmh = (distance / timeDiffSeconds) * 3600;
  return Math.round(speedKmh);
}
