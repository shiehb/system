"use client";

import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  LayersControl,
  Marker,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useEffect, useRef } from "react";

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

// CSS for drawing tools
const drawingStyle = `
  .leaflet-draw-toolbar {
    margin-top: 10px;
  }
  .leaflet-draw-toolbar a {
    background-color: white;
    border: 2px solid #ccc;
    border-radius: 4px;
  }
  .leaflet-draw-toolbar a:hover {
    background-color: #f0f0f0;
  }
  .leaflet-draw-actions {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .leaflet-draw-actions a {
    border-bottom: 1px solid #eee;
  }
  .leaflet-draw-actions a:last-child {
    border-bottom: none;
  }
`;

interface PolygonData {
  coordinates: number[][][];
  type: "Polygon";
}

interface PolygonDrawingMapProps {
  latitude?: string;
  longitude?: string;
  existingPolygon?: PolygonData | null;
  onPolygonChange?: (polygon: PolygonData | null) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
  height?: string;
}

// Component to handle centering on coordinates
function CenterOnCoordinates({
  latitude,
  longitude,
}: {
  latitude?: string;
  longitude?: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      const lat = Number.parseFloat(latitude);
      const lng = Number.parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 16, { duration: 1 });
      }
    }
  }, [latitude, longitude, map]);

  return null;
}

export function PolygonDrawingMap({
  latitude,
  longitude,
  existingPolygon,
  onPolygonChange,
  onCoordinatesChange,
  readOnly = false,
  height = "100%",
}: PolygonDrawingMapProps) {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  // Calculate initial center
  const getCenter = (): [number, number] => {
    if (latitude && longitude) {
      const lat = Number.parseFloat(latitude);
      const lng = Number.parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
    // Default center (DENR La Union Office)
    return [16.59773215097869, 120.3224520157828];
  };

  // Load existing polygon
  useEffect(() => {
    if (existingPolygon && featureGroupRef.current) {
      const featureGroup = featureGroupRef.current;
      featureGroup.clearLayers();

      try {
        const polygon = L.polygon(
          existingPolygon.coordinates[0].map(([lng, lat]) => [lat, lng]),
          {
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
            weight: 2,
          }
        );
        featureGroup.addLayer(polygon);
      } catch (error) {
        console.error("Error loading existing polygon:", error);
      }
    }
  }, [existingPolygon]);

  const handleCreated = (e: any) => {
    const { layer } = e;
    if (layer instanceof L.Polygon) {
      const coordinates = layer
        .getLatLngs()[0]
        .map((latlng: L.LatLng) => [latlng.lng, latlng.lat]);

      const polygonData: PolygonData = {
        type: "Polygon",
        coordinates: [coordinates],
      };

      onPolygonChange?.(polygonData);
    }
  };

  const handleEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Polygon) {
        const coordinates = layer
          .getLatLngs()[0]
          .map((latlng: L.LatLng) => [latlng.lng, latlng.lat]);

        const polygonData: PolygonData = {
          type: "Polygon",
          coordinates: [coordinates],
        };

        onPolygonChange?.(polygonData);
      }
    });
  };

  const handleDeleted = (e: any) => {
    onPolygonChange?.(null);
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onCoordinatesChange && !readOnly) {
      onCoordinatesChange(e.latlng.lat, e.latlng.lng);
    }
  };

  // Calculate marker position
  const markerPosition: [number, number] | null =
    latitude && longitude
      ? [Number.parseFloat(latitude), Number.parseFloat(longitude)]
      : null;

  return (
    <div className="h-full w-full relative">
      <style>{drawingStyle}</style>

      <MapContainer
        center={getCenter()}
        zoom={latitude && longitude ? 16 : 10}
        style={{ height, width: "100%" }}
        eventHandlers={{
          click: handleMapClick,
        }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>

        <CenterOnCoordinates latitude={latitude} longitude={longitude} />

        {/* Point marker for establishment location */}
        {markerPosition && <Marker position={markerPosition} icon={redIcon} />}

        <FeatureGroup ref={featureGroupRef}>
          {!readOnly && (
            <EditControl
              position="topleft"
              onCreated={handleCreated}
              onEdited={handleEdited}
              onDeleted={handleDeleted}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: {
                  allowIntersection: false,
                  drawError: {
                    color: "#e74c3c",
                    message:
                      "<strong>Error:</strong> Shape edges cannot cross!",
                  },
                  shapeOptions: {
                    color: "#3b82f6",
                    fillColor: "#3b82f6",
                    fillOpacity: 0.2,
                    weight: 2,
                  },
                },
              }}
              edit={{
                featureGroup: featureGroupRef.current!,
                remove: true,
                edit: true,
              }}
            />
          )}
        </FeatureGroup>
      </MapContainer>

      {/* Instructions overlay */}
      {!readOnly && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg max-w-xs z-[1000]">
          <h4 className="font-semibold text-sm mb-2">Drawing Instructions:</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Click the polygon tool to start drawing</li>
            <li>• Click points to create polygon boundaries</li>
            <li>• Double-click to finish drawing</li>
            <li>• Use edit tool to modify existing polygons</li>
            <li>• Click map to set establishment location</li>
          </ul>
        </div>
      )}
    </div>
  );
}
