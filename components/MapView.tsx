'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PlaceCard, HiddenGemCard } from '@/types/travel';

// Leaflet's default marker icons reference asset paths that don't resolve
// under Next.js bundling — rebuild them from the package's own URLs.
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapViewProps {
  centerLat: number;
  centerLon: number;
  places: (PlaceCard | HiddenGemCard)[];
}

export function MapView({ centerLat, centerLon, places }: MapViewProps) {
  const markers = useMemo(
    () => places.filter((p): p is PlaceCard & { latitude: number; longitude: number } => Boolean(p.latitude && p.longitude)),
    [places]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200" role="group" aria-label="Map of recommended places">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '420px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((place) => (
          <Marker key={place.name} position={[place.latitude, place.longitude]} icon={defaultIcon}>
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.category}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {markers.length === 0 && (
        <p className="p-3 text-center text-sm text-slate-500">
          Exact coordinates aren't available for this plan yet — showing the city center only.
        </p>
      )}
    </div>
  );
}
