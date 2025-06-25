import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface InspectionTask {
  id: string;
  inspector: {
    first_name: string;
    last_name: string;
  };
  establishments: {
    id?: string | number;
    name: string;
    address?: string;
  }[];
  startDate: string;
  endDate: string;
}

interface InspectionTaskTableProps {
  tasks: InspectionTask[];
}

export default function InspectionTaskTable({
  tasks,
}: InspectionTaskTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Inspector</TableHead>
          <TableHead>Establishments</TableHead>
          <TableHead>Date Range</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">
              {task.inspector.first_name} {task.inspector.last_name}
            </TableCell>
            <TableCell>{task.establishments.length} establishment(s)</TableCell>
            <TableCell>
              {format(new Date(task.startDate), "MMM dd, yyyy")} -{" "}
              {format(new Date(task.endDate), "MMM dd, yyyy")}
            </TableCell>
            <TableCell className="text-right">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="max-w-md w-full">
                  <SheetHeader>
                    <SheetTitle>Inspection Task Details</SheetTitle>
                    <SheetDescription>
                      Detailed information about this inspection assignment.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="p-4 space-y-4">
                    <div>
                      <span className="font-medium">Inspector:</span>{" "}
                      {task.inspector.first_name} {task.inspector.last_name}
                    </div>
                    <div>
                      <span className="font-medium">Date Range:</span>{" "}
                      {format(new Date(task.startDate), "MMM dd, yyyy")} -{" "}
                      {format(new Date(task.endDate), "MMM dd, yyyy")}
                    </div>
                    <div>
                      <span className="font-medium">Establishments:</span>
                      {task.establishments.length > 0 ? (
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          {task.establishments.map((est) => (
                            <li key={est.id ?? est.name}>
                              <span className="font-semibold">{est.name}</span>
                              {est.address && (
                                <span className="text-muted-foreground text-xs block">
                                  {est.address}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-muted-foreground text-sm mt-2">
                          No establishments assigned.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                    <Button variant="secondary" size="sm" className="w-full">
                      Print Task Details
                    </Button>
                    <Button variant="destructive" size="sm" className="w-full">
                      Remove Task
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
