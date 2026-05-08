import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { fetchISSPosition, fetchAstronauts, fetchGeoName } from '@/services/issService';
import { calculateSpeed } from '@/utils/haversine';

const MAX_POSITIONS = 15;
const MAX_SPEEDS    = 30;
const POLL_MS       = 15000; // exactly 15 seconds — open-notify requirement
const GEO_INTERVAL  = 60000; // max 1 geocode per 60 seconds

const ISSContext = createContext(null);

export function ISSProvider({ children }) {
  const [position,     setPosition]     = useState(null);
  const [positions,    setPositions]    = useState([]);
  const [speeds,       setSpeeds]       = useState([]);
  const [astronauts,   setAstronauts]   = useState(null);
  const [region,       setRegion]       = useState('Acquiring…');
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [lastUpdated,  setLastUpdated]  = useState(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const prevRef      = useRef(null);   // last position for Haversine
  const isFetching   = useRef(false);  // prevent overlapping requests
  const lastGeoTime  = useRef(0);      // timestamp of last geocode call
  const lastGeoCoords = useRef(null);  // { lat, lon } of last geocoded position
  const intervalRef  = useRef(null);   // single interval reference

  // ─── ISS position fetch (guarded against overlapping calls) ────────────────
  const fetchPosition = useCallback(async () => {
    if (isFetching.current) return; // skip if previous request still in-flight
    isFetching.current = true;

    try {
      const pos = await fetchISSPosition();

      // Speed — only calculate when we have a previous position
      if (prevRef.current) {
        const speed = calculateSpeed(prevRef.current, pos);
        if (speed > 0 && !isNaN(speed)) {
          setCurrentSpeed(speed);
          const timeLabel = new Date(pos.timestamp * 1000).toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
          });
          setSpeeds(prev => {
            const next = [...prev, { time: timeLabel, speed }];
            return next.length > MAX_SPEEDS ? next.slice(-MAX_SPEEDS) : next;
          });
        }
      }
      prevRef.current = pos;

      setPosition(pos);
      setLastUpdated(new Date(pos.timestamp * 1000));

      setPositions(prev => {
        const next = [...prev, pos];
        return next.length > MAX_POSITIONS ? next.slice(-MAX_POSITIONS) : next;
      });

      // Reverse geocoding — throttled: 60s cooldown AND 0.5° move threshold
      const now = Date.now();
      const lastCoords = lastGeoCoords.current;
      const movedEnough = !lastCoords ||
        Math.abs(pos.latitude  - lastCoords.lat) > 0.5 ||
        Math.abs(pos.longitude - lastCoords.lon) > 0.5;

      if (movedEnough && now - lastGeoTime.current >= GEO_INTERVAL) {
        lastGeoTime.current  = now;
        lastGeoCoords.current = { lat: pos.latitude, lon: pos.longitude };
        fetchGeoName(pos.latitude, pos.longitude)
          .then(name => setRegion(name || 'Ocean / Remote Area'))
          .catch(() => {});
      }

      setError(null);
      setLoading(false);
    } catch (err) {
      if (err?.response?.status === 429) {
        // Rate limited — silently skip this tick, do NOT set error state
        console.warn('[ISS] Rate limited (429) — skipping tick');
      } else {
        setError(err.message || 'Failed to fetch ISS position');
        setLoading(false);
      }
    } finally {
      isFetching.current = false;
    }
  }, []); // no deps — stable reference, no re-creation on re-render

  // ─── Astronauts — fetch ONLY ONCE on mount ─────────────────────────────────
  useEffect(() => {
    fetchAstronauts()
      .then(data => setAstronauts(data))
      .catch(() => {}); // non-critical, silent fail
  }, []); // empty array = runs once

  // ─── Polling — single interval, proper cleanup ─────────────────────────────
  useEffect(() => {
    fetchPosition(); // immediate first fetch
    intervalRef.current = setInterval(fetchPosition, POLL_MS);

    return () => {
      // Cleanup: clear the ONE interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchPosition]); // fetchPosition is stable (no deps in useCallback)

  const refresh = useCallback(() => {
    if (!isFetching.current) {
      setLoading(true);
      fetchPosition();
    }
  }, [fetchPosition]);

  return (
    <ISSContext.Provider
      value={{
        position, positions, speeds, astronauts,
        region, loading, error, lastUpdated,
        currentSpeed, refresh,
      }}
    >
      {children}
    </ISSContext.Provider>
  );
}

export function useISSContext() {
  const ctx = useContext(ISSContext);
  if (!ctx) throw new Error('useISSContext must be used within ISSProvider');
  return ctx;
}
