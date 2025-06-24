import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Establishment {
  id: number;
  name: string;
  address: string;
  coordinates: string;
  year: string;
  createdAt: string;
}

interface EstablishmentsListProps {
  establishments: Establishment[];
}

export default function EstablishmentsList({
  establishments,
}: EstablishmentsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Establishments</CardTitle>
        <CardDescription>List of all registered establishments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {establishments.map((est) => (
              <TableRow key={est.id}>
                <TableCell>{est.name}</TableCell>
                <TableCell>{est.address}</TableCell>
                <TableCell>{est.coordinates}</TableCell>
                <TableCell>{est.year}</TableCell>
                <TableCell>{est.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
