'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ lat, lon }: { lat: number; lon: number }) {
  return (
    <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>
            📍 Current Location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
