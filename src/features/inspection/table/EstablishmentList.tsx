import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

interface Establishment {
  id: number;
  name: string;
  address: string;
}

interface EstablishmentListProps {
  establishments: Establishment[];
  selected: number[];
  onToggle: (id: number, checked: boolean) => void;
  withSearch?: boolean;
}

export function EstablishmentList({
  establishments,
  selected,
  onToggle,
  withSearch = true,
}: EstablishmentListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEstablishments = useMemo(() => {
    if (!searchTerm) return establishments;
    return establishments.filter(
      (est) =>
        est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [establishments, searchTerm]);

  if (establishments.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        No establishments available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {withSearch && (
        <Input
          placeholder="Search establishments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
      )}

      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {filteredEstablishments.map((est) => (
          <div
            key={est.id}
            className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded"
          >
            <Checkbox
              id={`est-${est.id}`}
              checked={selected.includes(est.id)}
              onCheckedChange={(checked) => onToggle(est.id, Boolean(checked))}
            />
            <div className="flex-1">
              <label
                htmlFor={`est-${est.id}`}
                className="font-medium text-sm cursor-pointer flex flex-col"
              >
                <span>{est.name}</span>
                <span className="text-xs text-muted-foreground">
                  {est.address}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {filteredEstablishments.length === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No matching establishments found
        </div>
      )}
    </div>
  );
}
