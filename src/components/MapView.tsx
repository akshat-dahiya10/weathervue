"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MapViewProps = {
  lat: number;
  lon: number;
};

export default function MapView({ lat, lon }: MapViewProps) {
  return (
    <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={[lat, lon] as [number, number]}   // ✅ FIX
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='© OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lon] as [number, number]}>
          <Popup>Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
