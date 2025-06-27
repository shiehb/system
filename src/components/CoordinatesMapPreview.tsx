// components/CoordinatesMapPreview.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Map, X } from "lucide-react";
import { EstablishmentMap } from "./EstablishmentMap";
import type { Establishment } from "@/lib/establishmentApi";

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
  const [showMap, setShowMap] = useState(false);

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
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="absolute right-0 top-0 z-[1000]"
        onClick={() => setShowMap(!showMap)}
      >
        {showMap ? (
          <>
            <X className="h-4 w-4 mr-1" />
          </>
        ) : (
          <>
            <Map className="h-4 w-4 mr-1" />
          </>
        )}
      </Button>

      {showMap && (
        <div className="mt-2 h-64 rounded-md overflow-hidden border">
          <EstablishmentMap
            establishments={latitude && longitude ? [establishment] : []}
            selectedEstablishment={establishment}
            onMarkerClick={() => {}}
            onMapClick={handleMapClick}
          />
        </div>
      )}
    </div>
  );
}
