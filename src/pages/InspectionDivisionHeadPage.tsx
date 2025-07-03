// src/features/inspection/InspectionDivisionHeadPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import Water from "@/features/inspection/table/Water";
import Air from "@/features/inspection/table/Air";
import Toxic from "@/features/inspection/table/Toxic";
import SolidWaste from "@/features/inspection/table/SolidWaste";
import EIA from "@/features/inspection/table/EIA";
import { DialogTable } from "@/features/inspection/table/DialogTable";
import { dialogEstablishments } from "@/features/inspection/table/dialogData";

export default function InspectionDivisionHeadPage() {
  const [activeTab, setActiveTab] = useState("water");
  const [assignOpen, setAssignOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogSelected, setDialogSelected] = useState<number[]>([]);

  const handleAssign = () => {
    setAssignOpen(true);
    setDialogSelected([]);
    setSearchTerm("");
  };

  const handleConfirmAssignment = () => {
    console.log("Assigning establishments:", {
      establishments: dialogSelected,
      tab: activeTab,
    });
    setAssignOpen(false);
    setDialogSelected([]);
  };

  const filteredEstablishments = dialogEstablishments.filter(
    (est) =>
      est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid grid-cols-5 bg-gray-100">
            <TabsTrigger value="water" className="data-[state=active]:bg-white">
              Water
            </TabsTrigger>
            <TabsTrigger value="air" className="data-[state=active]:bg-white">
              Air
            </TabsTrigger>
            <TabsTrigger value="toxic" className="data-[state=active]:bg-white">
              Toxic
            </TabsTrigger>
            <TabsTrigger
              value="solidwaste"
              className="data-[state=active]:bg-white"
            >
              Solid Waste
            </TabsTrigger>
            <TabsTrigger value="eia" className="data-[state=active]:bg-white">
              EIA
            </TabsTrigger>
          </TabsList>

          <Button onClick={handleAssign} className="ml-4">
            + Assign New Inspection
          </Button>
        </div>

        <TabsContent value="water">
          <Water />
        </TabsContent>
        <TabsContent value="air">
          <Air />
        </TabsContent>
        <TabsContent value="toxic">
          <Toxic />
        </TabsContent>
        <TabsContent value="solidwaste">
          <SolidWaste />
        </TabsContent>
        <TabsContent value="eia">
          <EIA />
        </TabsContent>
      </Tabs>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Assign New Inspection Task
            </DialogTitle>
          </DialogHeader>

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
                selected={dialogSelected}
                onSelect={setDialogSelected}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-sm text-gray-600">
                {dialogSelected.length} establishment
                {dialogSelected.length !== 1 ? "s" : ""} selected
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setAssignOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAssignment}
                  disabled={dialogSelected.length === 0}
                >
                  Assign Inspections
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
