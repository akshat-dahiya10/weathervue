"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MapViewProps = {
  lat: number;
  lon: number;
};

export default function MapView({ lat, lon }: MapViewProps) {
  const position: [number, number] = [lat, lon];

  return (
    <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={position as any}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position as any}>
          <Popup>Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
