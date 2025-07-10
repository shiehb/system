"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Plus, CheckCircle, XCircle, FileText } from "lucide-react";
import { toast } from "sonner";

interface Establishment {
  id: number;
  name: string;
  address: string;
  category: string;
  lastInspection?: {
    date: string;
    status: string;
    inspector: string;
  };
  assignedLaw?: string;
  assignedCategory?: string;
  status: "not_started" | "in_process" | "done" | "approved" | "returned";
  editComments?: string;
  sectionsToEdit?: string[];
}

interface InspectionTable {
  id: string;
  name: string;
  type: "air" | "water" | "eia" | "toxic" | "solidwaste";
  establishments: Establishment[];
}

// All available establishments (master list)
const allEstablishments: Establishment[] = [
  {
    id: 1,
    name: "ABC Manufacturing Corp",
    address: "123 Industrial Ave, Quezon City",
    category: "Manufacturing",
    status: "not_started",
    lastInspection: {
      date: "2024-01-15",
      status: "Compliant",
      inspector: "John Doe",
    },
  },
  {
    id: 2,
    name: "XYZ Chemical Plant",
    address: "456 Chemical St, Makati City",
    category: "Chemical Processing",
    status: "not_started",
  },
  {
    id: 3,
    name: "DEF Textile Mills",
    address: "789 Textile Rd, Pasig City",
    category: "Textile",
    status: "not_started",
  },
  {
    id: 4,
    name: "GHI Mining Corp",
    address: "321 Mining Ave, Baguio City",
    category: "Mining",
    status: "not_started",
  },
  {
    id: 5,
    name: "JKL Chemical Storage",
    address: "654 Storage St, Cavite City",
    category: "Chemical Storage",
    status: "not_started",
  },
  {
    id: 6,
    name: "MNO Waste Treatment",
    address: "987 Treatment Rd, Laguna",
    category: "Waste Management",
    status: "not_started",
  },
  {
    id: 7,
    name: "PQR Power Plant",
    address: "111 Power St, Bataan",
    category: "Power Generation",
    status: "not_started",
  },
  {
    id: 8,
    name: "STU Food Processing",
    address: "222 Food Ave, Pampanga",
    category: "Food Processing",
    status: "not_started",
  },
];

const mockTables: InspectionTable[] = [
  {
    id: "air",
    name: "Air Quality Monitoring",
    type: "air",
    establishments: [],
  },
  {
    id: "water",
    name: "Water Quality Monitoring",
    type: "water",
    establishments: [],
  },
  {
    id: "eia",
    name: "Environmental Impact Assessment",
    type: "eia",
    establishments: [],
  },
  {
    id: "toxic",
    name: "Toxic Substances Monitoring",
    type: "toxic",
    establishments: [],
  },
  {
    id: "solidwaste",
    name: "Solid Waste Management",
    type: "solidwaste",
    establishments: [],
  },
];

const laws = [
  "Clean Air Act",
  "Clean Water Act",
  "Ecological Solid Waste Management Act",
  "Toxic Substances and Hazardous Waste Act",
  "Environmental Impact Assessment",
];

const inspectionSections = [
  "General Information",
  "Purpose of Inspection",
  "Compliance Status",
  "Summary of Compliance",
  "Findings & Observations",
  "Recommendations",
];

export default function DivisionChiefInterface() {
  const [activeTab, setActiveTab] = useState("air");
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedEstablishments, setSelectedEstablishments] = useState<
    number[]
  >([]);
  const [selectedLaw, setSelectedLaw] = useState("");
  const [showLastInspectionDetails, setShowLastInspectionDetails] =
    useState<Establishment | null>(null);
  const [showReturnForm, setShowReturnForm] = useState<Establishment | null>(
    null
  );
  const [showReviewForm, setShowReviewForm] = useState<Establishment | null>(
    null
  );
  const [returnComments, setReturnComments] = useState("");
  const [sectionsToEdit, setSectionsToEdit] = useState<string[]>([]);
  const [tables, setTables] = useState(mockTables);

  const getCurrentTable = () => tables.find((t) => t.id === activeTab);

  const getStatusBadge = (status: string) => {
    const variants = {
      not_started: "secondary",
      in_process: "default",
      done: "outline",
      approved: "default",
      returned: "destructive",
    } as const;

    const labels = {
      not_started: "Not Started",
      in_process: "In Process",
      done: "Done",
      approved: "Approved",
      returned: "Returned for Edit",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getAvailableEstablishments = () => {
    const assignedIds = tables.flatMap((table) =>
      table.establishments.map((est) => est.id)
    );
    return allEstablishments.filter((est) => !assignedIds.includes(est.id));
  };

  const handleAssignEstablishments = () => {
    if (selectedEstablishments.length === 0 || !selectedLaw) {
      toast.error("Please select establishments and applicable law");
      return;
    }

    const establishmentsToAssign = allEstablishments
      .filter((est) => selectedEstablishments.includes(est.id))
      .map((est) => ({
        ...est,
        assignedLaw: selectedLaw,
        assignedCategory: est.category,
        status: "not_started" as const,
      }));

    const updatedTables = tables.map((table) => {
      if (table.id === activeTab) {
        return {
          ...table,
          establishments: [...table.establishments, ...establishmentsToAssign],
        };
      }
      return table;
    });

    setTables(updatedTables);
    setShowAssignmentForm(false);
    setSelectedEstablishments([]);
    setSelectedLaw("");
    toast.success("Establishments assigned successfully");
  };

  const handleApproveInspection = (establishmentId: number) => {
    const updatedTables = tables.map((table) => {
      if (table.id === activeTab) {
        const updatedEstablishments = table.establishments.map((est) =>
          est.id === establishmentId
            ? { ...est, status: "approved" as const }
            : est
        );
        return { ...table, establishments: updatedEstablishments };
      }
      return table;
    });

    setTables(updatedTables);
    toast.success("Inspection approved");
  };

  const handleReturnForEdit = () => {
    if (!showReturnForm || !returnComments || sectionsToEdit.length === 0) {
      toast.error("Please provide comments and select sections to edit");
      return;
    }

    const updatedTables = tables.map((table) => {
      if (table.id === activeTab) {
        const updatedEstablishments = table.establishments.map((est) =>
          est.id === showReturnForm.id
            ? {
                ...est,
                status: "returned" as const,
                editComments: returnComments,
                sectionsToEdit: sectionsToEdit,
              }
            : est
        );
        return { ...table, establishments: updatedEstablishments };
      }
      return table;
    });

    setTables(updatedTables);
    setShowReturnForm(null);
    setReturnComments("");
    setSectionsToEdit([]);
    toast.info("Inspection returned for editing");
  };

  const currentTable = getCurrentTable();
  const availableEstablishments = getAvailableEstablishments();

  if (showAssignmentForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Assign Establishments - {currentTable?.name}
          </h2>
          <Button
            variant="outline"
            onClick={() => setShowAssignmentForm(false)}
          >
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Establishments and Applicable Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Applicable Law</Label>
              <Select onValueChange={setSelectedLaw} value={selectedLaw}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select applicable law" />
                </SelectTrigger>
                <SelectContent>
                  {laws.map((law) => (
                    <SelectItem key={law} value={law}>
                      {law}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">
                Available Establishments
              </Label>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded p-4">
                {availableEstablishments.map((establishment) => (
                  <div
                    key={establishment.id}
                    className="flex items-center space-x-3 p-2 hover:bg-muted rounded"
                  >
                    <Checkbox
                      id={`est-${establishment.id}`}
                      checked={selectedEstablishments.includes(
                        establishment.id
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEstablishments([
                            ...selectedEstablishments,
                            establishment.id,
                          ]);
                        } else {
                          setSelectedEstablishments(
                            selectedEstablishments.filter(
                              (id) => id !== establishment.id
                            )
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`est-${establishment.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{establishment.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {establishment.address}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Category: {establishment.category}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAssignmentForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignEstablishments}>
                Assign Selected Establishments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showLastInspectionDetails) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Last Inspection Details</h2>
          <Button
            variant="outline"
            onClick={() => setShowLastInspectionDetails(null)}
          >
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{showLastInspectionDetails.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">
                  Establishment Details
                </Label>
                <div className="mt-2 space-y-2">
                  <p>
                    <strong>Name:</strong> {showLastInspectionDetails.name}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {showLastInspectionDetails.address}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {showLastInspectionDetails.category}
                  </p>
                </div>
              </div>

              {showLastInspectionDetails.lastInspection && (
                <div>
                  <Label className="text-base font-medium">
                    Last Inspection
                  </Label>
                  <div className="mt-2 space-y-2">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(
                        showLastInspectionDetails.lastInspection.date
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {showLastInspectionDetails.lastInspection.status}
                    </p>
                    <p>
                      <strong>Inspector:</strong>{" "}
                      {showLastInspectionDetails.lastInspection.inspector}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showReviewForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Review Inspection Form - {showReviewForm.name}
          </h2>
          <Button variant="outline" onClick={() => setShowReviewForm(null)}>
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inspection Form Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">
                  Establishment Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {showReviewForm.name}
                  </p>
                  <p>
                    <strong>Address:</strong> {showReviewForm.address}
                  </p>
                  <p>
                    <strong>Category:</strong> {showReviewForm.category}
                  </p>
                  <p>
                    <strong>Applicable Law:</strong>{" "}
                    {showReviewForm.assignedLaw}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Inspection Status</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Current Status:</strong>{" "}
                    {getStatusBadge(showReviewForm.status)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Form Sections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {inspectionSections.map((section) => (
                  <div key={section} className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section}</span>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowReviewForm(null)}>
                Close Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showReturnForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Return Inspection for Edit - {showReturnForm.name}
          </h2>
          <Button variant="outline" onClick={() => setShowReturnForm(null)}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Specify Sections to Edit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">
                Select sections that need editing:
              </Label>
              <div className="mt-3 space-y-2">
                {inspectionSections.map((section) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                      id={`section-${section}`}
                      checked={sectionsToEdit.includes(section)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSectionsToEdit([...sectionsToEdit, section]);
                        } else {
                          setSectionsToEdit(
                            sectionsToEdit.filter((s) => s !== section)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`section-${section}`}
                      className="cursor-pointer"
                    >
                      {section}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">
                Comments and Instructions
              </Label>
              <Textarea
                placeholder="Provide specific comments about what needs to be corrected or improved..."
                value={returnComments}
                onChange={(e) => setReturnComments(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowReturnForm(null)}>
                Cancel
              </Button>
              <Button onClick={handleReturnForEdit}>Return for Edit</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Division Chief - Inspection Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Managing 3 Section Chiefs: Air Quality, Water Quality, EIA, Toxic
            Substances, and Solid Waste
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="air">Air Quality</TabsTrigger>
              <TabsTrigger value="water">Water Quality</TabsTrigger>
              <TabsTrigger value="eia">EIA</TabsTrigger>
              <TabsTrigger value="toxic">Toxic Substances</TabsTrigger>
              <TabsTrigger value="solidwaste">Solid Waste</TabsTrigger>
            </TabsList>

            {tables.map((table) => (
              <TabsContent
                key={table.id}
                value={table.id}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{table.name}</h3>
                  <Button onClick={() => setShowAssignmentForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Establishments
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Establishment</TableHead>
                      <TableHead>Assigned Law</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Inspection</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.establishments.map((establishment) => (
                      <TableRow key={establishment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {establishment.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {establishment.address}
                            </div>
                            {establishment.status === "returned" &&
                              establishment.editComments && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                                  <strong>Edit Required:</strong>{" "}
                                  {establishment.editComments}
                                  {establishment.sectionsToEdit && (
                                    <div className="mt-1">
                                      <strong>Sections:</strong>{" "}
                                      {establishment.sectionsToEdit.join(", ")}
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {establishment.assignedLaw || "-"}
                        </TableCell>
                        <TableCell>
                          {establishment.assignedCategory || "-"}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(establishment.status)}
                        </TableCell>
                        <TableCell>
                          {establishment.lastInspection ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setShowLastInspectionDetails(establishment)
                              }
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {establishment.status === "done" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setShowReviewForm(establishment)
                                  }
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproveInspection(establishment.id)
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setShowReturnForm(establishment)
                                  }
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Return for Edit
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
