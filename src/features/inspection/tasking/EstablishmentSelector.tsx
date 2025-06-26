import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface Establishment {
  id: number;
  name: string;
  address: string;
}

interface EstablishmentSelectorProps {
  selected: Establishment[];
  onSelect: (establishments: Establishment[]) => void;
}

const mockEstablishments: Establishment[] = [
  { id: 1, name: "ABC Manufacturing", address: "123 Industrial Rd" },
  { id: 2, name: "XYZ Foods", address: "456 Commerce St" },
  { id: 3, name: "Acme Corp", address: "789 Business Ave" },
];

export default function EstablishmentSelector({
  selected,
  onSelect,
}: EstablishmentSelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleEstablishment = (est: Establishment) => {
    if (selected.some((e) => e.id === est.id)) {
      onSelect(selected.filter((e) => e.id !== est.id));
    } else {
      onSelect([...selected, est]);
    }
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selected.length > 0
              ? selected.length === 1
                ? selected[0].name
                : `${selected.length} establishments selected`
              : "Select establishments..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search establishments..." />
            <CommandList>
              <CommandEmpty>No establishments found.</CommandEmpty>
              <CommandGroup>
                {mockEstablishments.map((est) => (
                  <CommandItem
                    key={est.id}
                    onSelect={() => {
                      toggleEstablishment(est);
                      setOpen(true);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.some((e) => e.id === est.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{est.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {est.address}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((est) => (
            <Badge
              key={est.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {est.name}
              <button
                type="button"
                onClick={() => toggleEstablishment(est)}
                className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
              >
                <span className="sr-only">Remove</span>
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
