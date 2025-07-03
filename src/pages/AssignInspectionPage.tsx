// src/features/inspection/AssignInspectionPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTable } from "@/features/inspection/table/DialogTable";
import { dialogEstablishments } from "@/features/inspection/table/dialogData";
import { Link } from "react-router-dom";

export default function AssignInspectionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const filteredEstablishments = dialogEstablishments.filter(
    (est) =>
      est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmAssignment = () => {
    console.log("Assigning establishments:", {
      establishments: selected,
    });
    // Here you would typically navigate back or show a success message
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assign New Inspection Task</h1>
        <Link to="a/inspection">
          <Button variant="outline">Back to Inspection Dashboard</Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search Establishments</Label>
          <Input
            id="search"
            placeholder="Filter by name, address or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="border rounded-lg overflow-hidden">
          <DialogTable
            establishments={filteredEstablishments}
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-gray-600">
            {selected.length} establishment
            {selected.length !== 1 ? "s" : ""} selected
          </div>
          <div className="space-x-2">
            <Link to="/inspection">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              onClick={handleConfirmAssignment}
              disabled={selected.length === 0}
            >
              Assign Inspections
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
