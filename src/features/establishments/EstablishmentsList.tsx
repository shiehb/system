import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEstablishment } from "@/lib/establishmentApi";
import type { Establishment } from "@/lib/establishmentApi";

interface EstablishmentsListProps {
  establishments: Establishment[];
  onDelete?: (id: number) => void;
  onEdit?: (establishment: Establishment) => void;
}

type SortableKey = keyof Pick<
  Establishment,
  "name" | "year_established" | "createdAt"
>;

export default function EstablishmentsList({
  establishments,
  onDelete,
  onEdit,
}: EstablishmentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKey;
    direction: "ascending" | "descending";
  } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Handle sorting
  const requestSort = (key: SortableKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const sortedAndFilteredEstablishments = useMemo(() => {
    let filtered = [...establishments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((est) =>
        Object.values(est).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        // Handle undefined values by treating them as empty strings for comparison
        const aValue = a[sortConfig.key]?.toString() || "";
        const bValue = b[sortConfig.key]?.toString() || "";

        // Special handling for createdAt to sort by date
        if (sortConfig.key === "createdAt") {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return sortConfig.direction === "ascending"
            ? aDate - bDate
            : bDate - aDate;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [establishments, searchTerm, sortConfig]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteEstablishment(id);
      onDelete?.(id);
      toast.success("Establishment deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        "Failed to delete establishment. It may have already been removed."
      );
      if (onDelete) {
        onDelete(id);
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="rounded-none">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-medium text-xl">
              Establishment List
            </CardTitle>
            <CardDescription>
              {sortedAndFilteredEstablishments.length} of{" "}
              {establishments.length} establishments shown
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search establishments..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("name")}
                    className="p-0 hover:bg-transparent"
                  >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent w-full justify-start"
                  >
                    Address
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent w-full justify-start"
                  >
                    Coordinates
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("year_established")}
                    className="p-0 hover:bg-transparent"
                  >
                    Year
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("createdAt")}
                    className="p-0 hover:bg-transparent"
                  >
                    Date Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredEstablishments.length > 0 ? (
                sortedAndFilteredEstablishments.map((est) => (
                  <TableRow key={est.id}>
                    <TableCell className="font-medium">{est.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {est.address || "Not specified"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {est.coordinates}
                    </TableCell>
                    <TableCell>{est.year || "N/A"}</TableCell>
                    <TableCell>
                      {est.createdAt
                        ? new Date(est.createdAt).toLocaleDateString()
                        : "Not available"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit?.(est)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(est.id)}
                          disabled={deletingId === est.id}
                        >
                          {deletingId === est.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No establishments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
