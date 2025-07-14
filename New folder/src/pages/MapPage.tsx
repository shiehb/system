// @/pages/MapPage.tsx
import { useEffect, useState } from "react";
import { fetchEstablishments } from "@/lib/establishmentApi";
import type { Establishment } from "@/lib/establishmentApi";
import { EstablishmentMap } from "@/components/map/EstablishmentMap";
import { EstablishmentDetails } from "@/features/map/EstablishmentDetails";
import { EstablishmentMapList } from "@/features/map/EstablishmentMapList";

export default function MapPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEstablishments = async () => {
      try {
        setIsLoading(true);
        const data = await fetchEstablishments();
        setEstablishments(data);
        if (data.length > 0) {
          setSelectedEstablishment(data[0]);
        }
      } catch (err) {
        setError("Failed to load establishments");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEstablishments();
  }, []);

  const handleEstablishmentSelect = (est: Establishment) => {
    setSelectedEstablishment(est);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-1 md:min-h-[calc(100vh-64px)]">
      <div className="w-[350px] h-full border-l border-gray-200 overflow-y-auto">
        <EstablishmentMapList
          establishments={establishments}
          selectedEstablishment={selectedEstablishment}
          onSelect={handleEstablishmentSelect}
        />
      </div>
      <div className="flex-1 h-full pl-0 pb-0 p-2 flex flex-col">
        <div className="flex-1">
          <EstablishmentMap
            establishments={establishments}
            selectedEstablishment={selectedEstablishment}
            onMarkerClick={handleEstablishmentSelect}
          />
        </div>
        <div className="bg-muted/50 p-4 mt-2 border">
          <EstablishmentDetails establishment={selectedEstablishment} />
        </div>
      </div>
    </div>
  );
}
