// src/features/inspection/table/DialogTable.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface Establishment {
  id: number;
  name: string;
  address: string;
  category: string;
  lastInspection: string;
  laws?: string[];
}

interface DialogTableProps {
  establishments: Establishment[];
  selected: number[];
  onSelect: (ids: number[]) => void;
  onLawsUpdate?: (id: number, laws: string[]) => void;
}

const LAW_OPTIONS = ["RA-6969", "RA-8749", "RA-9003", "RA-9275"];

export function DialogTable({
  establishments,
  selected,
  onSelect,
  onLawsUpdate = () => {},
}: DialogTableProps) {
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);

  const toggleSelectAll = (checked: boolean) => {
    onSelect(checked ? establishments.map((est) => est.id) : []);
  };

  const toggleSelectOne = (id: number, checked: boolean) => {
    onSelect(checked ? [...selected, id] : selected.filter((i) => i !== id));
  };

  const handleLawToggle = (id: number, law: string) => {
    const establishment = establishments.find((est) => est.id === id);
    if (!establishment) return;

    const currentLaws = establishment.laws || [];
    const newLaws = currentLaws.includes(law)
      ? currentLaws.filter((l) => l !== law)
      : [...currentLaws, law];

    onLawsUpdate(id, newLaws);
  };

  const handleBulkLawSelection = (id: number, selectAll: boolean) => {
    onLawsUpdate(id, selectAll ? [...LAW_OPTIONS] : []);
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table headers remain the same */}
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={
                    establishments.length > 0 &&
                    establishments.every((est) => selected.includes(est.id))
                  }
                  onCheckedChange={(checked) =>
                    toggleSelectAll(checked === true)
                  }
                />
                <Label htmlFor="select-all" className="sr-only">
                  Select all establishments
                </Label>
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Establishment
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Law
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Last Inspection
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {establishments.map((est) => (
            <tr key={est.id} className="hover:bg-gray-50">
              {/* Checkbox cell */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`select-${est.id}`}
                    checked={selected.includes(est.id)}
                    onCheckedChange={(checked) =>
                      toggleSelectOne(est.id, checked === true)
                    }
                  />
                  <Label htmlFor={`select-${est.id}`} className="sr-only">
                    Select {est.name}
                  </Label>
                </div>
              </td>

              {/* Establishment info cell */}
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {est.name}
                </div>
                <div className="text-sm text-gray-500">{est.address}</div>
              </td>

              {/* Category cell */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {est.category}
              </td>

              {/* Law cell with dropdown functionality */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  {/* Display selected laws */}
                  {est.laws?.map((law) => (
                    <div
                      key={law}
                      className="flex items-center bg-gray-100 rounded-md px-2 py-1"
                    >
                      <span className="text-xs mr-1">{law}</span>
                      <button
                        onClick={() => handleLawToggle(est.id, law)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Law dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => setDropdownOpenId(est.id)}
                      >
                        Add more
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 p-2"
                      onInteractOutside={() => setDropdownOpenId(null)}
                    >
                      <div className="space-y-2">
                        {LAW_OPTIONS.map((law) => {
                          const isChecked = est.laws?.includes(law) || false;
                          return (
                            <DropdownMenuItem
                              key={law}
                              className="p-0"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <div
                                className="flex items-center space-x-2 w-full p-2"
                                onClick={() => handleLawToggle(est.id, law)}
                              >
                                <Checkbox
                                  id={`${est.id}-${law}`}
                                  checked={isChecked}
                                  onCheckedChange={() => {}}
                                />
                                <Label
                                  htmlFor={`${est.id}-${law}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {law}
                                </Label>
                              </div>
                            </DropdownMenuItem>
                          );
                        })}
                        <div className="flex justify-between pt-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleBulkLawSelection(est.id, true)}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() =>
                              handleBulkLawSelection(est.id, false)
                            }
                          >
                            Clear All
                          </Button>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>

              {/* Last inspection cell */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {est.lastInspection}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
