import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import EstablishmentSelector from "./EstablishmentSelector";
import PersonnelSelector from "./PersonnelSelector";
import InspectionTaskTable from "./InspectionTaskTable";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

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

  const confirmSubmit = () => {
    setShowSaveDialog(false);
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      handleSubmit();
      setIsSubmitting(false);
      toast.success("Inspection task created successfully");
    }, 1000);
  };

  const resetForm = () => {
    setSelectedEstablishments([]);
    setSelectedInspector(null);
    setStartDate("");
    setEndDate("");
  };

  const confirmReset = () => {
    setShowClearDialog(false);
    resetForm();
    toast.info("Form cleared");
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col lg:flex-row w-full flex-1">
        {/* Sidebar - Task Creation */}
        <div className="w-full lg:w-[350px]">
          <Card className="md:min-h-[calc(100vh-59px)] rounded-none flex flex-col">
            <CardHeader>
              <CardTitle className="m-0 text-xl">Create Inspection</CardTitle>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Establishments *</Label>
                  </div>
                  <EstablishmentSelector
                    selected={selectedEstablishments}
                    onSelect={setSelectedEstablishments}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Inspector *</Label>
                  </div>
                  <PersonnelSelector
                    selected={selectedInspector}
                    onSelect={setSelectedInspector}
                    userLevel="inspector"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Inspection Date Range *</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Summary */}
              <div className="space-y-2">
                <Label className="font-medium">Task Summary</Label>
                <div className="h-35 rounded-md border p-4 bg-muted/50">
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
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 w-full px-6 mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowClearDialog(true)}
                disabled={
                  !selectedInspector && selectedEstablishments.length === 0
                }
                className="w-full sm:flex-1 capitalize"
              >
                CLEAR FORM
              </Button>
              <Button
                onClick={() => setShowSaveDialog(true)}
                disabled={
                  selectedEstablishments.length === 0 ||
                  !selectedInspector ||
                  !startDate ||
                  !endDate
                }
                className="w-full sm:flex-1 capitalize"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isSubmitting ? "Creating..." : "CREATE TASK"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Task Table */}
        <div className="flex-1">
          <Card className="md:min-h-[calc(100vh-59px)] rounded-none">
            <CardHeader>
              <CardTitle className="m-0 text-xl">Inspection List</CardTitle>
              <Separator />
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <InspectionTaskTable tasks={tasks} />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No inspection tasks created yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Task Creation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this inspection task?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Creating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Form Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Clear Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear the form?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>
              Clear Form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
