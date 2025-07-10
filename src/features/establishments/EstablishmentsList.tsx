"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Archive,
  ArchiveRestore,
  MapPin,
  Map,
  Building2,
  Calendar,
  MapIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { Establishment } from "@/lib/establishmentApi";
import {
  fetchEstablishments,
  fetchArchivedEstablishments,
  archiveEstablishment,
  unarchiveEstablishment,
  searchEstablishments,
} from "@/lib/establishmentApi";
import { EstablishmentPolygonViewer } from "@/components/map/EstablishmentPolygonViewer";

interface EstablishmentsListProps {
  onAdd: () => void;
  onEdit: (establishment: Establishment) => void;
}

export default function EstablishmentsList({
  onAdd,
  onEdit,
}: EstablishmentsListProps) {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [archivedEstablishments, setArchivedEstablishments] = useState<
    Establishment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [mapEstablishment, setMapEstablishment] =
    useState<Establishment | null>(null);

  // Load establishments
  const loadEstablishments = async () => {
    try {
      setLoading(true);
      const [activeData, archivedData] = await Promise.all([
        fetchEstablishments(),
        fetchArchivedEstablishments(),
      ]);
      setEstablishments(activeData);
      setArchivedEstablishments(archivedData);
    } catch (error) {
      toast.error("Failed to load establishments");
      console.error("Error loading establishments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstablishments();
  }, []);

  // Search functionality
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await searchEstablishments(query);
        setEstablishments(results);
      } catch (error) {
        toast.error("Search failed");
        console.error("Search error:", error);
      }
    } else {
      loadEstablishments();
    }
  };

  // Filter establishments based on search
  const filteredEstablishments = useMemo(() => {
    const currentList =
      activeTab === "active" ? establishments : archivedEstablishments;
    if (!searchQuery.trim()) return currentList;

    return currentList.filter(
      (est) =>
        est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.address_line.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.nature_of_business?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [establishments, archivedEstablishments, searchQuery, activeTab]);

  // Archive establishment
  const handleArchive = async () => {
    if (!selectedEstablishment) return;

    try {
      await archiveEstablishment(selectedEstablishment.id);
      toast.success("Establishment archived successfully");
      loadEstablishments();
    } catch (error) {
      toast.error("Failed to archive establishment");
      console.error("Archive error:", error);
    } finally {
      setShowArchiveDialog(false);
      setSelectedEstablishment(null);
    }
  };

  // Unarchive establishment
  const handleUnarchive = async () => {
    if (!selectedEstablishment) return;

    try {
      await unarchiveEstablishment(selectedEstablishment.id);
      toast.success("Establishment restored successfully");
      loadEstablishments();
    } catch (error) {
      toast.error("Failed to restore establishment");
      console.error("Unarchive error:", error);
    } finally {
      setShowUnarchiveDialog(false);
      setSelectedEstablishment(null);
    }
  };

  // Show map dialog
  const handleShowMap = (establishment: Establishment) => {
    setMapEstablishment(establishment);
    setShowMapDialog(true);
  };

  // Format address
  const formatAddress = (establishment: Establishment) => {
    return `${establishment.address_line}, ${establishment.barangay}, ${establishment.city}, ${establishment.province}`;
  };

  // Check if establishment has map data
  const hasMapData = (establishment: Establishment) => {
    return establishment.latitude && establishment.longitude;
  };

  // Check if establishment has polygon
  const hasPolygon = (establishment: Establishment) => {
    return (
      establishment.polygon && establishment.polygon.coordinates.length > 0
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading establishments...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Establishments</h1>
          <p className="text-muted-foreground">
            Manage establishment records and locations
          </p>
        </div>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Establishment
        </Button>
      </div>

      {/* Search and Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Establishment Records</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search establishments..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Active ({establishments.length})
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Archived ({archivedEstablishments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <EstablishmentTable
                establishments={filteredEstablishments}
                onEdit={onEdit}
                onArchive={(est) => {
                  setSelectedEstablishment(est);
                  setShowArchiveDialog(true);
                }}
                onShowMap={handleShowMap}
                isArchived={false}
              />
            </TabsContent>

            <TabsContent value="archived" className="mt-6">
              <EstablishmentTable
                establishments={filteredEstablishments}
                onEdit={onEdit}
                onUnarchive={(est) => {
                  setSelectedEstablishment(est);
                  setShowUnarchiveDialog(true);
                }}
                onShowMap={handleShowMap}
                isArchived={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Establishment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{selectedEstablishment?.name}"?
              This will move it to the archived section but won't delete the
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unarchive Confirmation Dialog */}
      <AlertDialog
        open={showUnarchiveDialog}
        onOpenChange={setShowUnarchiveDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Establishment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore "{selectedEstablishment?.name}"?
              This will move it back to the active establishments list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnarchive}>
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Map Dialog */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapIcon className="h-5 w-5" />
              {mapEstablishment?.name} - Location & Boundaries
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full">
            {mapEstablishment && (
              <EstablishmentPolygonViewer
                establishment={mapEstablishment}
                height="calc(80vh - 120px)"
                showControls={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Establishment Table Component
interface EstablishmentTableProps {
  establishments: Establishment[];
  onEdit: (establishment: Establishment) => void;
  onArchive?: (establishment: Establishment) => void;
  onUnarchive?: (establishment: Establishment) => void;
  onShowMap: (establishment: Establishment) => void;
  isArchived: boolean;
}

function EstablishmentTable({
  establishments,
  onEdit,
  onArchive,
  onUnarchive,
  onShowMap,
  isArchived,
}: EstablishmentTableProps) {
  const formatAddress = (establishment: Establishment) => {
    return `${establishment.address_line}, ${establishment.barangay}, ${establishment.city}, ${establishment.province}`;
  };

  const hasMapData = (establishment: Establishment) => {
    return establishment.latitude && establishment.longitude;
  };

  const hasPolygon = (establishment: Establishment) => {
    return (
      establishment.polygon && establishment.polygon.coordinates.length > 0
    );
  };

  if (establishments.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No establishments found</h3>
        <p className="text-muted-foreground">
          {isArchived
            ? "No archived establishments to display."
            : "Get started by adding your first establishment."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Year Est.</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Boundaries</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {establishments.map((establishment) => (
            <TableRow key={establishment.id}>
              <TableCell className="font-medium">
                {establishment.name}
              </TableCell>
              <TableCell className="max-w-[200px]">
                <div className="truncate" title={formatAddress(establishment)}>
                  {formatAddress(establishment)}
                </div>
              </TableCell>
              <TableCell>
                {establishment.nature_of_business ? (
                  <Badge variant="secondary">
                    {establishment.nature_of_business.name}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </TableCell>
              <TableCell>
                {establishment.year_established ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {establishment.year_established}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {hasMapData(establishment) ? (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Located
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onShowMap(establishment)}
                      className="h-6 px-2"
                    >
                      <Map className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-600"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    No Location
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {hasPolygon(establishment) ? (
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-600"
                  >
                    <Map className="h-3 w-3 mr-1" />
                    Defined (
                    {establishment.polygon?.coordinates[0]?.length || 0} pts)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <Map className="h-3 w-3 mr-1" />
                    No Boundary
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {hasMapData(establishment) && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onShowMap(establishment)}
                        >
                          <Map className="mr-2 h-4 w-4" />
                          View Map
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => onEdit(establishment)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isArchived ? (
                      <DropdownMenuItem
                        onClick={() => onUnarchive?.(establishment)}
                      >
                        <ArchiveRestore className="mr-2 h-4 w-4" />
                        Restore
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onArchive?.(establishment)}
                        className="text-destructive"
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
