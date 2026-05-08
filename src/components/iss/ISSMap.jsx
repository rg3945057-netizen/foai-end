import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon paths broken by Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom ISS icon using inline SVG DivIcon
const ISS_ICON = L.divIcon({
  className: '',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -24],
  html: `
    <div style="
      width:44px; height:44px;
      background: radial-gradient(circle, rgba(0,245,255,0.25) 0%, transparent 70%);
      border: 2px solid #00f5ff;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 14px #00f5ff88;
      animation: issPulse 1.5s ease-in-out infinite;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
           fill="none" stroke="#00f5ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <line x1="12" y1="2" x2="12" y2="22"/>
        <line x1="2"  y1="12" x2="22" y2="12"/>
        <line x1="5"  y1="5"  x2="8"  y2="8"/>
        <line x1="19" y1="5"  x2="16" y2="8"/>
        <line x1="5"  y1="19" x2="8"  y2="16"/>
        <line x1="19" y1="19" x2="16" y2="16"/>
      </svg>
    </div>
    <style>
      @keyframes issPulse {
        0%,100%{ transform: scale(1); box-shadow:0 0 14px #00f5ff88; }
        50%     { transform: scale(1.12); box-shadow:0 0 24px #00f5ffcc; }
      }
    </style>
  `,
});

/** Sub-component: pans map to new ISS position */
function MapPanner({ position }) {
  const map = useMap();
  const prevRef = useRef(null);
  useEffect(() => {
    if (!position) return;
    const latlng = [position.latitude, position.longitude];
    if (!prevRef.current) {
      map.setView(latlng, map.getZoom(), { animate: false });
    } else {
      map.panTo(latlng, { animate: true, duration: 1.2 });
    }
    prevRef.current = latlng;
  }, [position, map]);
  return null;
}

export function ISSMap({ position, positions }) {
  const trajectory = positions.map((p) => [p.latitude, p.longitude]);

  return (
    <div className="w-full h-full rounded-b-2xl overflow-hidden" style={{ minHeight: 320 }}>
      <MapContainer
        center={position ? [position.latitude, position.longitude] : [0, 0]}
        zoom={3}
        style={{ width: '100%', height: '100%', background: '#0a0f2e' }}
        zoomControl={true}
        attributionControl={true}
      >
        {/* Dark CartoDB tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Trajectory polyline */}
        {trajectory.length > 1 && (
          <Polyline
            positions={trajectory}
            pathOptions={{
              color: '#00f5ff',
              weight: 2.5,
              opacity: 0.7,
              dashArray: '6 4',
            }}
          />
        )}

        {/* ISS marker */}
        {position && (
          <Marker position={[position.latitude, position.longitude]} icon={ISS_ICON}>
            <Popup className="iss-popup">
              <div style={{ minWidth: 180, fontFamily: 'monospace', color: '#00f5ff' }}>
                <strong style={{ color: '#fff' }}>🛸 ISS Current Position</strong>
                <br />
                Lat: {position.latitude.toFixed(4)}°
                <br />
                Lon: {position.longitude.toFixed(4)}°
                <br />
                <span style={{ fontSize: 11, color: '#888' }}>
                  {new Date(position.timestamp * 1000).toLocaleTimeString()}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        <MapPanner position={position} />
      </MapContainer>
    </div>
  );
}
