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
  CalendarDays,
  MapPin,
  Calendar,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { Establishment } from "@/lib/establishmentApi";
import { fetchNatureOfBusinessOptions } from "@/lib/establishmentApi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface EstablishmentsListProps {
  establishments: Establishment[];
  onEdit?: (establishment: Establishment) => void;
  onShowAddForm?: () => void;
}

type SortableKey = keyof Pick<
  Establishment,
  "name" | "year_established" | "createdAt"
>;

export default function EstablishmentsList({
  establishments,
  onEdit,
  onShowAddForm,
}: EstablishmentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKey;
    direction: "ascending" | "descending";
  }>({ key: "createdAt", direction: "descending" });
  const [businessTypes, setBusinessTypes] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(true);

  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        setLoadingBusinessTypes(true);
        const types = await fetchNatureOfBusinessOptions();
        setBusinessTypes(types);
      } catch (error) {
        console.error("Failed to load business types:", error);
        toast.error("Failed to load business types");
      } finally {
        setLoadingBusinessTypes(false);
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

  const getBusinessTypeName = (id?: number | null) => {
    if (!id) return "Not specified";
    const foundType = businessTypes.find((type) => type.id === id);
    return foundType ? foundType.name : "Unknown type";
  };

  const formatAddress = (est: Establishment) => {
    const parts = [
      est.address_line,
      est.barangay,
      est.city,
      est.province,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "No address provided";
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
                    className="p-0 hover:bg-transparent flex items-center"
                  >
                    Name
                    {sortConfig.key === "name" ? (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    ) : (
                      <span className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("createdAt")}
                    className="p-0 hover:bg-transparent flex items-center"
                  >
                    Date Created
                    {sortConfig.key === "createdAt" ? (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    ) : (
                      <span className="ml-2 h-4 w-4" />
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
                          <Badge variant="outline">
                            {loadingBusinessTypes ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              getBusinessTypeName(est.nature_of_business?.id)
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Est. {est.year_established || "N/A"}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="font-medium">{formatAddress(est)}</div>
                      {est.latitude && est.longitude && (
                        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-mono">
                            {!isNaN(Number(est.latitude)) &&
                            !isNaN(Number(est.longitude))
                              ? `${Number(est.latitude).toFixed(4)}, ${Number(
                                  est.longitude
                                ).toFixed(4)}`
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
                            ? new Date(est.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit?.(est)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {searchTerm ? (
                      <div className="flex flex-col items-center gap-2">
                        <span>No establishments match your search</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear search
                        </Button>
                      </div>
                    ) : (
                      "No establishments found"
                    )}
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
