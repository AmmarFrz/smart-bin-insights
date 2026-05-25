import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons (Leaflet + Vite issue)
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  height?: string;
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const lastRef = useRef<[number, number] | null>(null);
  useEffect(() => {
    const last = lastRef.current;
    if (!last || last[0] !== lat || last[1] !== lng) {
      map.setView([lat, lng], map.getZoom());
      lastRef.current = [lat, lng];
    }
  }, [lat, lng, map]);
  return null;
}

export function MapPicker({ latitude, longitude, onChange, height = "300px" }: MapPickerProps) {
  // Default to Jakarta if no coords
  const center: [number, number] = [
    latitude ?? -6.2088,
    longitude ?? 106.8456,
  ];

  return (
    <div className="rounded-lg overflow-hidden border border-border" style={{ height }}>
      <MapContainer
        center={center}
        zoom={latitude && longitude ? 16 : 11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        <ClickHandler onChange={onChange} />
        {latitude !== null && longitude !== null && (
          <>
            <Marker position={[latitude, longitude]} />
            <RecenterMap lat={latitude} lng={longitude} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
