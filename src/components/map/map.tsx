// components/map/map.tsx
import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  center: [number, number];
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  style?: React.CSSProperties;
  className?: string;
  onZoomChange?: (zoom: number) => void;
  onCenterChange?: (center: [number, number]) => void;
  children?: React.ReactNode;
}

const MapEvents: React.FC<{
  onZoomChange?: (zoom: number) => void;
  onCenterChange?: (center: [number, number]) => void;
}> = ({ onZoomChange, onCenterChange }) => {
  useMapEvents({
    zoomend: (e) => {
      if (onZoomChange) onZoomChange(e.target.getZoom());
    },
    moveend: (e) => {
      const center = e.target.getCenter();
      if (onCenterChange) onCenterChange([center.lat, center.lng]);
    },
  });

  return null;
};

const Map: React.FC<MapProps> = ({
  center,
  zoom,
  minZoom = 1,
  maxZoom = 22,
  style = { height: "100%", width: "100%" },
  className,
  onZoomChange,
  onCenterChange,
  children,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      style={style}
      className={className}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onZoomChange={onZoomChange} onCenterChange={onCenterChange} />
      {children}
    </MapContainer>
  );
};

export default Map;
