import axios from 'axios';
import { ISS_API } from '@/constants';

/**
 * Fetch current ISS position from wheretheiss.at
 */
export async function fetchISSPosition() {
  const res = await axios.get(ISS_API.POSITION, { timeout: 8000 });
  return res.data; // { latitude, longitude, altitude, velocity, timestamp, ... }
}

/**
 * Fetch list of astronauts currently in space
 */
export async function fetchAstronauts() {
  const res = await axios.get(ISS_API.ASTRONAUTS, { timeout: 8000 });
  return res.data; // { number, people: [{ name, craft }] }
}
