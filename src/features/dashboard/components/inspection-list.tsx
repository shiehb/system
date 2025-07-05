import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function InspectionList() {
  const inspections = [
    {
      id: 1,
      establishment: "ABC Corporation",
      date: "2023-11-15",
      status: "pending",
    },
    // Add more sample data
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Establishment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inspections.map((inspection) => (
            <TableRow key={inspection.id}>
              <TableCell className="font-medium">
                {inspection.establishment}
              </TableCell>
              <TableCell>{inspection.date}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    inspection.status === "pending" ? "secondary" : "default"
                  }
                >
                  {inspection.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
