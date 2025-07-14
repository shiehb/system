// @/features/map/EstablishmentMapList.tsx
import { useState, useMemo } from "react";
import type { Establishment } from "@/lib/establishmentApi";
import { Search, Building } from "lucide-react";

interface EstablishmentMapListProps {
  establishments: Establishment[];
  selectedEstablishment: Establishment | null;
  onSelect: (est: Establishment) => void;
}

export function EstablishmentMapList({
  establishments,
  selectedEstablishment,
  onSelect,
}: EstablishmentMapListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEstablishments = useMemo(() => {
    if (!searchQuery) return establishments;

    const query = searchQuery.toLowerCase();
    return establishments.filter(
      (est) =>
        est.name.toLowerCase().includes(query) ||
        est.address_line.toLowerCase().includes(query) ||
        est.city.toLowerCase().includes(query) ||
        est.province.toLowerCase().includes(query) ||
        (est.nature_of_business &&
          est.nature_of_business.toLowerCase().includes(query))
    );
  }, [establishments, searchQuery]);

  return (
    <div className="h-full w-full bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10 space-y-3">
        <h2 className="text-lg font-semibold">
          Establishments ({filteredEstablishments.length})
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search establishments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredEstablishments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {establishments.length === 0
              ? "No establishments found"
              : "No matching establishments found"}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredEstablishments.map((est) => (
              <div
                key={est.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedEstablishment?.id === est.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => onSelect(est)}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Building className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{est.name}</h3>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {est.address_line}, {est.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
