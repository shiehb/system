import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import type { Establishment } from "@/lib/establishmentApi";

// Fix for default marker icons in Leaflet
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

// Add a component to handle centering on the selected establishment
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
        18, // Zoom level
        {
          duration: 1, // Animation duration in seconds
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
}

export function EstablishmentMap({
  establishments,
  selectedEstablishment,
  onMarkerClick,
  onMapClick,
}: EstablishmentMapProps) {
  // Handle map click events if onMapClick is provided
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
    <div className="h-full w-full  overflow-hidden relative z-0">
      <MapContainer
        center={getCenter() as [number, number]}
        zoom={selectedEstablishment ? 14 : 6}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {onMapClick && <MapClickHandler />}

        {/* Add the center control */}
        <CenterOnSelected selectedEstablishment={selectedEstablishment} />

        {establishments.map((est) => {
          if (!est.latitude || !est.longitude) return null;

          return (
            <Marker
              key={est.id}
              position={[parseFloat(est.latitude), parseFloat(est.longitude)]}
              icon={
                selectedEstablishment?.id === est.id
                  ? L.icon({
                      ...defaultIcon.options,
                      className: "selected-marker",
                    })
                  : defaultIcon
              }
              eventHandlers={{
                click: () => {
                  onMarkerClick(est);
                },
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
