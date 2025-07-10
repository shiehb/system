"use client";

import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  LayersControl,
  Marker,
  useMapEvents,
  Polygon as LeafletPolygon,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useEffect, useRef, useState, useCallback } from "react";

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

// Create custom green marker icon for valid positions
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// CSS for drawing tools and cursor states
const drawingStyle = `
  .leaflet-draw-toolbar {
    margin-top: 10px;
    z-index: 1000;
  }
  .leaflet-draw-toolbar a {
    background-color: white;
    border: 2px solid #ccc;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  .leaflet-draw-toolbar a:hover {
    background-color: #f0f0f0;
    border-color: #3b82f6;
  }
  .leaflet-draw-toolbar a.leaflet-draw-toolbar-button-enabled {
    background-color: #3b82f6;
    color: white;
  }
  .leaflet-draw-actions {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    border: 1px solid #e5e7eb;
  }
  .leaflet-draw-actions a {
    border-bottom: 1px solid #eee;
    padding: 8px 12px;
    transition: background-color 0.2s ease;
  }
  .leaflet-draw-actions a:hover {
    background-color: #f9fafb;
  }
  .leaflet-draw-actions a:last-child {
    border-bottom: none;
  }
  .leaflet-draw-guide-dash {
    font-size: 1%;
    opacity: 0.8;
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3b82f6;
    border: 2px solid white;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
  }
  .leaflet-container {
    cursor: default !important;
  }
  .leaflet-dragging .leaflet-container {
    cursor: grabbing !important;
  }
  .leaflet-draggable {
    cursor: move !important;
  }
  .leaflet-draw-draw-polygon {
    cursor: crosshair !important;
  }
  .leaflet-draw-edit-edit {
    cursor: pointer !important;
  }
  .leaflet-draw-edit-remove {
    cursor: pointer !important;
  }
  .leaflet-interactive {
    cursor: pointer !important;
  }
  .leaflet-marker-draggable {
    cursor: move !important;
  }
  .leaflet-marker-draggable.invalid-position {
    filter: hue-rotate(0deg) saturate(2) brightness(1.2);
    animation: shake 0.5s ease-in-out;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }
  .polygon-preview {
    stroke-dasharray: 5, 5;
    animation: dash 1s linear infinite;
  }
  @keyframes dash {
    to {
      stroke-dashoffset: -10;
    }
  }
  .polygon-highlight {
    stroke-width: 3;
    stroke: #3b82f6;
    fill: rgba(59, 130, 246, 0.1);
    transition: all 0.3s ease;
  }
  .polygon-highlight:hover {
    fill: rgba(59, 130, 246, 0.2);
    stroke-width: 4;
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
  restrictPinToPolygon?: boolean;
}

// Utility function to check if a point is inside a polygon
function isPointInPolygon(
  point: [number, number],
  polygon: number[][]
): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = [polygon[i][1], polygon[i][0]]; // Note: coordinates are [lng, lat] but we need [lat, lng]
    const [xj, yj] = [polygon[j][1], polygon[j][0]];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
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

// Component to handle map events without interfering with drawing tools
function MapEventHandler({
  onCoordinatesChange,
  readOnly,
  isDrawing,
  polygon,
  restrictPinToPolygon,
}: {
  onCoordinatesChange?: (lat: number, lng: number) => void;
  readOnly: boolean;
  isDrawing: boolean;
  polygon?: PolygonData | null;
  restrictPinToPolygon?: boolean;
}) {
  useMapEvents({
    click: (e) => {
      // Only handle clicks when not in drawing mode and not read-only
      if (onCoordinatesChange && !readOnly && !isDrawing) {
        try {
          const { lat, lng } = e.latlng;
          if (
            typeof lat === "number" &&
            typeof lng === "number" &&
            !isNaN(lat) &&
            !isNaN(lng)
          ) {
            // Check if pin should be restricted to polygon
            if (restrictPinToPolygon && polygon && polygon.coordinates[0]) {
              const isInside = isPointInPolygon(
                [lat, lng],
                polygon.coordinates[0]
              );
              if (!isInside) {
                // Visual feedback for invalid position
                const marker = L.marker([lat, lng], { icon: redIcon })
                  .addTo(e.target)
                  .bindPopup("Pin must be placed within the polygon boundary")
                  .openPopup();

                setTimeout(() => {
                  e.target.removeLayer(marker);
                }, 2000);
                return;
              }
            }
            onCoordinatesChange(lat, lng);
          }
        } catch (error) {
          console.error("Error handling map click:", error);
        }
      }
    },
  });

  return null;
}

// Draggable marker component with polygon boundary restriction
function DraggableMarker({
  position,
  onDragEnd,
  readOnly,
  polygon,
  restrictToPolygon,
}: {
  position: [number, number] | null;
  onDragEnd?: (lat: number, lng: number) => void;
  readOnly: boolean;
  polygon?: PolygonData | null;
  restrictToPolygon?: boolean;
}) {
  const markerRef = useRef<L.Marker>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidPosition, setIsValidPosition] = useState(true);

  const checkValidPosition = useCallback(
    (lat: number, lng: number): boolean => {
      if (!restrictToPolygon || !polygon || !polygon.coordinates[0]) {
        return true;
      }
      return isPointInPolygon([lat, lng], polygon.coordinates[0]);
    },
    [restrictToPolygon, polygon]
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDrag = useCallback(
    (e: L.DragEndEvent) => {
      const marker = e.target as L.Marker;
      const newPosition = marker.getLatLng();
      const valid = checkValidPosition(newPosition.lat, newPosition.lng);
      setIsValidPosition(valid);

      // Update marker icon based on validity
      if (valid) {
        marker.setIcon(greenIcon);
      } else {
        marker.setIcon(redIcon);
      }
    },
    [checkValidPosition]
  );

  const handleDragEnd = useCallback(
    (e: L.DragEndEvent) => {
      const marker = e.target as L.Marker;
      const newPosition = marker.getLatLng();
      const valid = checkValidPosition(newPosition.lat, newPosition.lng);

      setIsDragging(false);

      if (valid && onDragEnd) {
        onDragEnd(newPosition.lat, newPosition.lng);
        marker.setIcon(redIcon); // Reset to normal icon
      } else if (!valid) {
        // Snap back to original position if invalid
        if (position) {
          marker.setLatLng(position);
          marker.setIcon(redIcon);
        }
        // Show error message
        marker
          .bindPopup("Pin must remain within the polygon boundary")
          .openPopup();
        setTimeout(() => {
          marker.closePopup();
        }, 3000);
      }
    },
    [checkValidPosition, onDragEnd, position]
  );

  useEffect(() => {
    if (position) {
      const valid = checkValidPosition(position[0], position[1]);
      setIsValidPosition(valid);
    }
  }, [position, checkValidPosition]);

  if (!position) return null;

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={isDragging ? (isValidPosition ? greenIcon : redIcon) : redIcon}
      draggable={!readOnly}
      eventHandlers={{
        dragstart: handleDragStart,
        drag: handleDrag,
        dragend: handleDragEnd,
      }}
      title={
        readOnly
          ? "Establishment Location"
          : "Establishment Location (Drag to move)"
      }
    />
  );
}

// Component to display existing polygon with enhanced visuals
function PolygonDisplay({
  polygon,
  isEditing,
}: {
  polygon: PolygonData;
  isEditing?: boolean;
}) {
  if (!polygon.coordinates[0] || polygon.coordinates[0].length < 3) {
    return null;
  }

  const positions = polygon.coordinates[0].map(
    ([lng, lat]) => [lat, lng] as [number, number]
  );

  return (
    <LeafletPolygon
      positions={positions}
      pathOptions={{
        color: isEditing ? "#fe57a1" : "#3b82f6",
        fillColor: isEditing ? "#fe57a1" : "#3b82f6",
        fillOpacity: isEditing ? 0.3 : 0.2,
        weight: isEditing ? 3 : 2,
        opacity: 0.8,
        className: isEditing ? "polygon-highlight" : "polygon-preview",
      }}
    />
  );
}

// Error boundary component for EditControl
function EditControlWrapper({
  featureGroup,
  onCreated,
  onEdited,
  onDeleted,
  onDrawStart,
  onDrawStop,
  onEditStart,
  onEditStop,
}: {
  featureGroup: L.FeatureGroup | null;
  onCreated: (e: any) => void;
  onEdited: (e: any) => void;
  onDeleted: (e: any) => void;
  onDrawStart: () => void;
  onDrawStop: () => void;
  onEditStart: () => void;
  onEditStop: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [featureGroup]);

  if (hasError || !featureGroup) {
    return null;
  }

  try {
    return (
      <EditControl
        position="topleft"
        onCreated={onCreated}
        onEdited={onEdited}
        onDeleted={onDeleted}
        onDrawStart={onDrawStart}
        onDrawStop={onDrawStop}
        onEditStart={onEditStart}
        onEditStop={onEditStop}
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
              message: "<strong>Error:</strong> Shape edges cannot cross!",
              timeout: 2000,
            },
            shapeOptions: {
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.2,
              weight: 2,
              opacity: 0.8,
            },
            showArea: true,
            showLength: true,
            metric: true,
            feet: false,
            repeatMode: false,
            icon: new L.DivIcon({
              iconSize: new L.Point(8, 8),
              className: "leaflet-div-icon leaflet-editing-icon",
            }),
          },
        }}
        edit={{
          featureGroup: featureGroup,
          remove: true,
          edit: {
            selectedPathOptions: {
              color: "#fe57a1",
              opacity: 0.8,
              dashArray: "10, 10",
              fill: true,
              fillColor: "#fe57a1",
              fillOpacity: 0.3,
              maintainColor: false,
              weight: 3,
            },
          },
        }}
      />
    );
  } catch (error) {
    console.error("EditControl error:", error);
    setHasError(true);
    return null;
  }
}

export function PolygonDrawingMap({
  latitude,
  longitude,
  existingPolygon,
  onPolygonChange,
  onCoordinatesChange,
  readOnly = false,
  height = "100%",
  restrictPinToPolygon = false,
}: PolygonDrawingMapProps) {
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState<PolygonData | null>(
    existingPolygon || null
  );

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

  // Update current polygon when existingPolygon changes
  useEffect(() => {
    setCurrentPolygon(existingPolygon || null);
  }, [existingPolygon]);

  // Load existing polygon
  useEffect(() => {
    if (currentPolygon && featureGroupRef.current && isMapReady) {
      const featureGroup = featureGroupRef.current;
      featureGroup.clearLayers();

      try {
        // Validate polygon coordinates
        if (
          currentPolygon.coordinates &&
          currentPolygon.coordinates[0] &&
          currentPolygon.coordinates[0].length >= 3
        ) {
          const coordinates = currentPolygon.coordinates[0].map(
            ([lng, lat]) => {
              // Validate coordinate values
              if (
                typeof lat === "number" &&
                typeof lng === "number" &&
                !isNaN(lat) &&
                !isNaN(lng) &&
                lat >= -90 &&
                lat <= 90 &&
                lng >= -180 &&
                lng <= 180
              ) {
                return [lat, lng] as [number, number];
              }
              throw new Error(`Invalid coordinates: [${lng}, ${lat}]`);
            }
          );

          const polygon = L.polygon(coordinates, {
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
            weight: 2,
            opacity: 0.8,
          });

          featureGroup.addLayer(polygon);
        }
      } catch (error) {
        console.error("Error loading existing polygon:", error);
        onPolygonChange?.(null);
      }
    }
  }, [currentPolygon, isMapReady, onPolygonChange]);

  const handleCreated = useCallback(
    (e: any) => {
      try {
        const { layer } = e;
        if (layer instanceof L.Polygon) {
          const latLngs = layer.getLatLngs()[0];

          // Validate that we have at least 3 points
          if (!Array.isArray(latLngs) || latLngs.length < 3) {
            console.error("Invalid polygon: insufficient points");
            return;
          }

          const coordinates = latLngs.map((latlng: L.LatLng) => {
            if (
              !latlng ||
              typeof latlng.lat !== "number" ||
              typeof latlng.lng !== "number"
            ) {
              throw new Error("Invalid LatLng object");
            }
            return [latlng.lng, latlng.lat];
          });

          // Close the polygon by ensuring first and last points are the same
          if (coordinates.length > 0) {
            const firstPoint = coordinates[0];
            const lastPoint = coordinates[coordinates.length - 1];
            if (
              firstPoint[0] !== lastPoint[0] ||
              firstPoint[1] !== lastPoint[1]
            ) {
              coordinates.push([firstPoint[0], firstPoint[1]]);
            }
          }

          const polygonData: PolygonData = {
            type: "Polygon",
            coordinates: [coordinates],
          };

          setCurrentPolygon(polygonData);
          onPolygonChange?.(polygonData);
        }
      } catch (error) {
        console.error("Error creating polygon:", error);
      }
    },
    [onPolygonChange]
  );

  const handleEdited = useCallback(
    (e: any) => {
      try {
        const layers = e.layers;
        let polygonData: PolygonData | null = null;

        layers.eachLayer((layer: L.Layer) => {
          if (layer instanceof L.Polygon) {
            const latLngs = layer.getLatLngs()[0];

            if (Array.isArray(latLngs) && latLngs.length >= 3) {
              const coordinates = latLngs.map((latlng: L.LatLng) => [
                latlng.lng,
                latlng.lat,
              ]);

              // Close the polygon
              if (coordinates.length > 0) {
                const firstPoint = coordinates[0];
                const lastPoint = coordinates[coordinates.length - 1];
                if (
                  firstPoint[0] !== lastPoint[0] ||
                  firstPoint[1] !== lastPoint[1]
                ) {
                  coordinates.push([firstPoint[0], firstPoint[1]]);
                }
              }

              polygonData = {
                type: "Polygon",
                coordinates: [coordinates],
              };
            }
          }
        });

        setCurrentPolygon(polygonData);
        onPolygonChange?.(polygonData);
      } catch (error) {
        console.error("Error editing polygon:", error);
      }
    },
    [onPolygonChange]
  );

  const handleDeleted = useCallback(
    (e: any) => {
      try {
        setCurrentPolygon(null);
        onPolygonChange?.(null);
      } catch (error) {
        console.error("Error deleting polygon:", error);
      }
    },
    [onPolygonChange]
  );

  const handleDrawStart = useCallback(() => {
    setIsDrawing(true);
  }, []);

  const handleDrawStop = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleEditStart = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleEditStop = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleMarkerDragEnd = useCallback(
    (lat: number, lng: number) => {
      if (onCoordinatesChange) {
        onCoordinatesChange(lat, lng);
      }
    },
    [onCoordinatesChange]
  );

  // Calculate marker position
  const markerPosition: [number, number] | null = (() => {
    if (latitude && longitude) {
      const lat = Number.parseFloat(latitude);
      const lng = Number.parseFloat(longitude);
      if (
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      ) {
        return [lat, lng];
      }
    }
    return null;
  })();

  return (
    <div className="h-full w-full relative">
      <style>{drawingStyle}</style>

      <MapContainer
        center={getCenter()}
        zoom={latitude && longitude ? 16 : 10}
        style={{ height, width: "100%" }}
        whenReady={() => setIsMapReady(true)}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={!isDrawing}
        touchZoom={true}
        boxZoom={!isDrawing}
        keyboard={true}
        dragging={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <CenterOnCoordinates latitude={latitude} longitude={longitude} />

        {/* Map event handler */}
        <MapEventHandler
          onCoordinatesChange={onCoordinatesChange}
          readOnly={readOnly}
          isDrawing={isDrawing}
          polygon={currentPolygon}
          restrictPinToPolygon={restrictPinToPolygon}
        />

        {/* Display existing polygon with enhanced visuals */}
        {currentPolygon && !readOnly && (
          <PolygonDisplay polygon={currentPolygon} isEditing={isEditing} />
        )}

        {/* Draggable marker for establishment location */}
        <DraggableMarker
          position={markerPosition}
          onDragEnd={handleMarkerDragEnd}
          readOnly={readOnly}
          polygon={currentPolygon}
          restrictToPolygon={restrictPinToPolygon}
        />

        <FeatureGroup ref={featureGroupRef}>
          {!readOnly && isMapReady && (
            <EditControlWrapper
              featureGroup={featureGroupRef.current}
              onCreated={handleCreated}
              onEdited={handleEdited}
              onDeleted={handleDeleted}
              onDrawStart={handleDrawStart}
              onDrawStop={handleDrawStop}
              onEditStart={handleEditStart}
              onEditStop={handleEditStop}
            />
          )}
        </FeatureGroup>
      </MapContainer>

      {/* Enhanced instructions overlay */}
      {!readOnly && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-[1000] border border-gray-200">
          <h4 className="font-semibold text-sm mb-3 text-gray-800">
            Map Controls:
          </h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>
                <strong>Red Pin:</strong> Drag to set location
                {restrictPinToPolygon ? " (restricted to polygon)" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>
                <strong>Green Pin:</strong> Valid position during drag
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span>
                <strong>Polygon Tool:</strong> Click to start drawing boundaries
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded-sm"></div>
              <span>
                <strong>Edit Tool:</strong> Modify existing shapes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-sm"></div>
              <span>
                <strong>Delete Tool:</strong> Remove shapes
              </span>
            </div>
          </div>
          {isDrawing && (
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">
                🎯 Drawing Mode: Click to add vertices, double-click to finish
              </p>
            </div>
          )}
          {isEditing && (
            <div className="mt-3 p-2 bg-pink-50 rounded border border-pink-200">
              <p className="text-xs text-pink-700 font-medium">
                ✏️ Edit Mode: Drag vertices to modify shape
              </p>
            </div>
          )}
          {restrictPinToPolygon && currentPolygon && (
            <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200">
              <p className="text-xs text-amber-700 font-medium">
                🔒 Pin movement restricted to polygon boundary
              </p>
            </div>
          )}
        </div>
      )}

      {/* Drawing status indicator */}
      {(isDrawing || isEditing) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200 z-[1000]">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isDrawing ? "bg-blue-500" : "bg-pink-500"
              } animate-pulse`}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              {isDrawing ? "Drawing Polygon..." : "Editing Polygon..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
