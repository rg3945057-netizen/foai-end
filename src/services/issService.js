import axios from "axios";
import { ISS_API, NOMINATIM_API } from "@/constants";

// In dev we use Vite server proxy (configured in vite.config.js). For production
// we provide serverless proxy endpoints under `/api/*` (see /api/*.js). These
// proxies fetch upstream data server-side, avoiding CORS and mixed-content problems.
const ISS_NOW = "/api/iss-now";
const ASTROS = "/api/astros";
const GEO_REVERSE = "/api/geo-reverse";

/**
 * Fetch current ISS position.
 * Returns { latitude, longitude, timestamp }
 */
export async function fetchISSPosition() {
  // wheretheiss.at returns a direct JSON object with latitude/longitude in production,
  // while the dev proxy returns the open-notify shape. Normalize both shapes.
  const res = await axios.get(ISS_NOW, { timeout: 8000 });
  const data = res.data;

  // open-notify proxy shape (dev): { message: 'success', iss_position: { latitude, longitude }, timestamp }
  if (data?.message === "success" && data.iss_position) {
    return {
      latitude: parseFloat(data.iss_position.latitude),
      longitude: parseFloat(data.iss_position.longitude),
      timestamp: data.timestamp,
    };
  }

  // wheretheiss.at shape (prod): { latitude, longitude, altitude, ... , timestamp }
  if (
    typeof data.latitude !== "undefined" &&
    typeof data.longitude !== "undefined"
  ) {
    return {
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      timestamp: data.timestamp || Math.floor(Date.now() / 1000),
    };
  }

  throw new Error("ISS API returned unexpected payload");
}

/**
 * Fetch people currently in space.
 * Returns { number, people: [{ name, craft }] }
 */
export async function fetchAstronauts() {
  try {
    const res = await axios.get(ASTROS, { timeout: 8000 });
    const data = res.data;

    // open-notify shape expected: { message: 'success', number, people }
    if (data?.message === "success")
      return { number: data.number, people: data.people };

    // If upstream shape differs, try to normalize simple { number, people }
    if (typeof data.number !== "undefined" && Array.isArray(data.people))
      return { number: data.number, people: data.people };

    console.warn("[ISS] Unexpected astronauts payload — returning null");
    return null;
  } catch (err) {
    // Mixed-content or network errors likely in production for open-notify (HTTP only).
    console.warn(
      "[ISS] Failed to fetch astronauts. In production open-notify.org may be HTTP-only and blocked by the browser.\n" +
        "Consider providing a server-side proxy endpoint to /api/astros or use an HTTPS mirror. Error:",
      err.message,
    );
    return null; // non-critical — UI already handles missing astronauts
  }
}

/**
 * Reverse geocode lat/lon → place name via Nominatim proxy.
 * No User-Agent header — browsers forbid setting it.
 */
export async function fetchGeoName(lat, lon) {
  try {
    const res = await axios.get(GEO_REVERSE, {
      params: { lat, lon, format: "json" },
      timeout: 6000,
    });
    const addr = res.data?.address || {};
    return (
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      addr.state ||
      addr.country ||
      res.data?.display_name?.split(",")[0] ||
      "Ocean / Remote Area"
    );
  } catch {
    // If reverse geocoding fails in production due to User-Agent or rate-limits,
    // we return a safe fallback. For reliable geocoding in production, provide
    // a server-side proxy (so you can set a User-Agent header) or a paid geocoding service.
    console.warn(
      "[ISS] Reverse geocoding failed; returning fallback place name.",
    );
    return "Ocean / Remote Area";
  }
}
