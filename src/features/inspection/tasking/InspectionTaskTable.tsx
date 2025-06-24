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

interface InspectionTask {
  id: string;
  inspector: {
    first_name: string;
    last_name: string;
  };
  establishments: {
    name: string;
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
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
