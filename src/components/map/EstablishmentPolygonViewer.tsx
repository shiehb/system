"use client";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Create custom red marker icon
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface PolygonData {
  coordinates: number[][][];
  type: "Polygon";
}

interface EstablishmentData {
  id: number;
  name: string;
  address_line: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  latitude?: string;
  longitude?: string;
  polygon?: PolygonData | null;
  nature_of_business?: {
    name: string;
  } | null;
}

interface EstablishmentPolygonViewerProps {
  establishment: EstablishmentData;
  height?: string;
  showControls?: boolean;
}

export function EstablishmentPolygonViewer({
  establishment,
  height = "400px",
  showControls = true,
}: EstablishmentPolygonViewerProps) {
  // Calculate center point
  const getCenter = (): [number, number] => {
    if (establishment.latitude && establishment.longitude) {
      const lat = Number.parseFloat(establishment.latitude);
      const lng = Number.parseFloat(establishment.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
    // Default center (DENR La Union Office)
    return [16.59773215097869, 120.3224520157828];
  };

  // Calculate zoom level based on available data
  const getZoom = (): number => {
    if (establishment.latitude && establishment.longitude) {
      return establishment.polygon ? 17 : 16;
    }
    return 10;
  };

  // Convert polygon coordinates for React Leaflet
  const polygonPositions: [number, number][] | null = establishment.polygon
    ? establishment.polygon.coordinates[0].map(
        ([lng, lat]) => [lat, lng] as [number, number]
      )
    : null;

  // Calculate marker position
  const markerPosition: [number, number] | null =
    establishment.latitude && establishment.longitude
      ? [
          Number.parseFloat(establishment.latitude),
          Number.parseFloat(establishment.longitude),
        ]
      : null;

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={getCenter()}
        zoom={getZoom()}
        style={{ height, width: "100%" }}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        {showControls && (
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Street Map">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </LayersControl.BaseLayer>
          </LayersControl>
        )}

        {!showControls && (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        )}

        {/* Establishment boundary polygon */}
        {polygonPositions && (
          <Polygon
            positions={polygonPositions}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.2,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-sm mb-1">
                  Establishment Boundary
                </h4>
                <p className="text-xs text-muted-foreground">
                  {establishment.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Area: {polygonPositions.length} boundary points
                </p>
              </div>
            </Popup>
          </Polygon>
        )}

        {/* Point marker for establishment location */}
        {markerPosition && (
          <Marker position={markerPosition} icon={redIcon}>
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h4 className="font-semibold text-sm mb-2">
                  {establishment.name}
                </h4>
                <div className="space-y-1 text-xs">
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {establishment.address_line}
                  </p>
                  <p>
                    <span className="font-medium">Barangay:</span>{" "}
                    {establishment.barangay}
                  </p>
                  <p>
                    <span className="font-medium">City:</span>{" "}
                    {establishment.city}
                  </p>
                  <p>
                    <span className="font-medium">Province:</span>{" "}
                    {establishment.province}
                  </p>
                  {establishment.nature_of_business && (
                    <p>
                      <span className="font-medium">Business:</span>{" "}
                      {establishment.nature_of_business.name}
                    </p>
                  )}
                  <div className="pt-1 border-t">
                    <p>
                      <span className="font-medium">Coordinates:</span>
                    </p>
                    <p>Lat: {establishment.latitude}</p>
                    <p>Lng: {establishment.longitude}</p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <div className="text-xs space-y-1">
          <h4 className="font-semibold">{establishment.name}</h4>
          <p className="text-muted-foreground">
            {establishment.city}, {establishment.province}
          </p>
          {establishment.polygon && (
            <p className="text-blue-600">
              ✓ Boundary defined (
              {establishment.polygon.coordinates[0]?.length || 0} points)
            </p>
          )}
          {!establishment.polygon && (
            <p className="text-amber-600">⚠ No boundary defined</p>
          )}
        </div>
      </div>
    </div>
  );
}
