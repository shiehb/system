import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EstablishmentSelector from "./EstablishmentSelector";
import PersonnelSelector from "./PersonnelSelector";
import { Label } from "@/components/ui/label";
import InspectionTaskTable from "./InspectionTaskTable";

interface Establishment {
  id: number;
  name: string;
  address: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_level: string;
}

interface InspectionTask {
  id: string;
  inspector: User;
  establishments: Establishment[];
  startDate: string;
  endDate: string;
}

export default function InspectionTasking() {
  const [selectedEstablishments, setSelectedEstablishments] = useState<
    Establishment[]
  >([]);
  const [selectedInspector, setSelectedInspector] = useState<User | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tasks, setTasks] = useState<InspectionTask[]>([]);

  const handleSubmit = () => {
    if (!selectedInspector) return;

    const newTask: InspectionTask = {
      id: Date.now().toString(),
      inspector: selectedInspector,
      establishments: selectedEstablishments,
      startDate,
      endDate,
    };

    setTasks([...tasks, newTask]);
    resetForm();
  };

  const resetForm = () => {
    setSelectedEstablishments([]);
    setSelectedInspector(null);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Inspection Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/*  Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Establishments</Label>
                <EstablishmentSelector
                  selected={selectedEstablishments}
                  onSelect={setSelectedEstablishments}
                />
              </div>
              <div className="space-y-2">
                <Label>Inspector</Label>
                <PersonnelSelector
                  selected={selectedInspector}
                  onSelect={setSelectedInspector}
                  userLevel="inspector"
                />
              </div>

              <div className="space-y-2">
                <Label>Inspection Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="start-date">Start</Label>
                    <input
                      id="start-date"
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="end-date">End</Label>
                    <input
                      id="end-date"
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/*  Date Range */}
            <div className="grid grid-cols-1 space-y-4">
              {/* Task Summary Preview */}
              <div className="space-y-2">
                <Label>Task Summary</Label>
                <div className="rounded-md border p-4 bg-muted/50">
                  {selectedInspector || selectedEstablishments.length > 0 ? (
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Inspector:</span>{" "}
                        {selectedInspector
                          ? `${selectedInspector.first_name} ${selectedInspector.last_name}`
                          : "Not selected"}
                      </p>
                      <p>
                        <span className="font-medium">Establishments:</span>{" "}
                        {selectedEstablishments.length}
                      </p>
                      <p>
                        <span className="font-medium">Date Range:</span>{" "}
                        {startDate && endDate
                          ? `${new Date(
                              startDate
                            ).toLocaleDateString()} - ${new Date(
                              endDate
                            ).toLocaleDateString()}`
                          : "Not set"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No task details yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={
                !selectedInspector && selectedEstablishments.length === 0
              }
            >
              Clear
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                selectedEstablishments.length === 0 ||
                !selectedInspector ||
                !startDate ||
                !endDate
              }
            >
              Create Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task Table */}
      {tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Created Inspection Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <InspectionTaskTable tasks={tasks} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
