// components/CoordinatesMapPreview.tsx
import type { Establishment } from "@/lib/establishmentApi";
import { EstablishmentMap } from "./EstablishmentMap";

interface CoordinatesMapPreviewProps {
  latitude: string;
  longitude: string;
  name?: string;
  onCoordinatesChange?: (lat: string, lng: string) => void;
}

export function CoordinatesMapPreview({
  latitude,
  longitude,
  name = "Location",
  onCoordinatesChange,
}: CoordinatesMapPreviewProps) {
  const establishment: Establishment = {
    id: 0,
    name,
    address_line: "",
    barangay: "",
    city: "",
    province: "",
    region: "",
    postal_code: "",
    latitude,
    longitude,
    year_established: null,
    nature_of_business: "",
    // Required fields with default values
    address: `${latitude}, ${longitude}`,
    coordinates: `${latitude}, ${longitude}`,
    year: "",
    createdAt: new Date().toISOString(),
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (onCoordinatesChange) {
      // Convert to strings without any digit limitation
      onCoordinatesChange(lat.toString(), lng.toString());
    }
  };

  return (
    <EstablishmentMap
      establishments={latitude && longitude ? [establishment] : []}
      selectedEstablishment={establishment}
      onMarkerClick={() => {}}
      onMapClick={handleMapClick}
    />
  );
}
