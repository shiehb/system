import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import type { Establishment } from "@/lib/establishmentApi";

// Default marker icon
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Green marker icon for selected establishments
const greenIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// CSS for cursor behavior
const mapStyle = `
  .leaflet-container {
    cursor: default !important;
  }
  .leaflet-dragging .leaflet-container {
    cursor: grabbing !important;
  }
  .leaflet-draggable {
    cursor: move !important;
  }
`;

// Component to handle centering on selected establishment
function CenterOnSelected({
  selectedEstablishment,
}: {
  selectedEstablishment: Establishment | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (
      selectedEstablishment &&
      selectedEstablishment.latitude &&
      selectedEstablishment.longitude
    ) {
      map.flyTo(
        [
          parseFloat(selectedEstablishment.latitude),
          parseFloat(selectedEstablishment.longitude),
        ],
        18,
        {
          duration: 1,
        }
      );
    }
  }, [selectedEstablishment, map]);

  return null;
}

interface EstablishmentMapProps {
  establishments: Establishment[];
  selectedEstablishment: Establishment | null;
  onMarkerClick: (est: Establishment) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerDragEnd?: (e: any) => void;
  draggable?: boolean;
}

export function EstablishmentMap({
  establishments,
  selectedEstablishment,
  onMarkerClick,
  onMapClick,
  onMarkerDragEnd,
  draggable = false,
}: EstablishmentMapProps) {
  // Handle map click events
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (onMapClick) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      },
    });
    return null;
  };

  // Calculate initial center of the map
  const getCenter = () => {
    if (
      selectedEstablishment &&
      selectedEstablishment.latitude &&
      selectedEstablishment.longitude
    ) {
      return [
        parseFloat(selectedEstablishment.latitude),
        parseFloat(selectedEstablishment.longitude),
      ];
    }

    if (establishments.length > 0) {
      const validEsts = establishments.filter(
        (est) => est.latitude && est.longitude
      );
      if (validEsts.length > 0) {
        const avgLat =
          validEsts.reduce((sum, est) => sum + parseFloat(est.latitude!), 0) /
          validEsts.length;
        const avgLng =
          validEsts.reduce((sum, est) => sum + parseFloat(est.longitude!), 0) /
          validEsts.length;
        return [avgLat, avgLng];
      }
    }

    // Default center (DENR La Union Office)
    return [16.59773215097869, 120.3224520157828];
  };

  return (
    <div className="h-full w-full overflow-hidden relative z-0">
      <style>{mapStyle}</style>

      <MapContainer
        center={getCenter() as [number, number]}
        zoom={selectedEstablishment ? 14 : 6}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {onMapClick && <MapClickHandler />}

        <CenterOnSelected selectedEstablishment={selectedEstablishment} />

        {establishments.map((est) => {
          if (!est.latitude || !est.longitude) return null;

          return (
            <Marker
              key={est.id}
              position={[parseFloat(est.latitude), parseFloat(est.longitude)]}
              icon={
                selectedEstablishment?.id === est.id ? greenIcon : defaultIcon
              }
              draggable={draggable}
              eventHandlers={{
                click: () => {
                  onMarkerClick(est);
                },
                dragend: onMarkerDragEnd,
              }}
            >
              <Popup>
                <div className="font-medium">{est.name}</div>
                <div>{est.address_line}</div>
                <div>
                  {est.city}, {est.province}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
