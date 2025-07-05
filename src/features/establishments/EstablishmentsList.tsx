import { useState, useMemo, useEffect } from "react";
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
import {
  ArrowUpDown,
  Search,
  Loader2,
  Pencil,
  Trash2,
  CalendarDays,
  MapPin,
  Calendar,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { deleteEstablishment } from "@/lib/establishmentApi";
import type { Establishment } from "@/lib/establishmentApi";
import { fetchNatureOfBusinessOptions } from "@/lib/establishmentApi";

interface EstablishmentsListProps {
  establishments: Establishment[];
  onDelete?: (id: number) => void;
  onEdit?: (establishment: Establishment) => void;
  onShowAddForm?: () => void;
}

type SortableKey = keyof Pick<
  Establishment,
  "name" | "year_established" | "createdAt"
>;

export default function EstablishmentsList({
  establishments,
  onDelete,
  onEdit,
  onShowAddForm,
}: EstablishmentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKey;
    direction: "ascending" | "descending";
  }>({ key: "createdAt", direction: "descending" });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [businessTypes, setBusinessTypes] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const types = await fetchNatureOfBusinessOptions();
        setBusinessTypes(types);
      } catch (error) {
        console.error("Failed to load business types:", error);
      }
    };
    fetchBusinessTypes();
  }, []);

  const requestSort = (key: SortableKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredEstablishments = useMemo(() => {
    let filtered = [...establishments];

    if (searchTerm) {
      filtered = filtered.filter((est) =>
        Object.values(est).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key]?.toString() || "";
      const bValue = b[sortConfig.key]?.toString() || "";

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
          <div className="flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search establishments..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {onShowAddForm && (
              <Button onClick={onShowAddForm} className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Add Establishment
              </Button>
            )}
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
                    {sortConfig.key === "name" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </Button>
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("createdAt")}
                    className="p-0 hover:bg-transparent"
                  >
                    Date Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                    {sortConfig.key === "createdAt" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredEstablishments.length > 0 ? (
                sortedAndFilteredEstablishments.map((est) => (
                  <TableRow key={est.id}>
                    <TableCell className="py-3">
                      <div className="font-medium">{est.name}</div>
                      <div className="text-sm text-muted-foreground space-y-1 mt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {est.nature_of_business
                              ? (() => {
                                  const foundType = businessTypes.find(
                                    (type) =>
                                      type.id.toString() ===
                                      est.nature_of_business?.toString()
                                  );
                                  return foundType
                                    ? foundType.name
                                    : est.nature_of_business?.toString();
                                })()
                              : "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Est. {est.year_established || "N/A"}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="font-medium">
                        {[
                          est.address_line,
                          est.barangay,
                          est.city,
                          est.province,
                          est.region,
                          est.postal_code,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                      {est.latitude && est.longitude && (
                        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-mono">
                            {!isNaN(Number(est.latitude)) &&
                            !isNaN(Number(est.longitude))
                              ? `${Number(est.latitude).toFixed(6)}, ${Number(
                                  est.longitude
                                ).toFixed(6)}`
                              : "Invalid coordinates"}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {est.createdAt
                            ? new Date(est.createdAt).toLocaleDateString()
                            : "Not available"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit?.(est)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(est.id)}
                          disabled={deletingId === est.id}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          {deletingId === est.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
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
