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
import { Eye, Send, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AssignedEstablishment {
  id: number;
  name: string;
  address: string;
  assignedLaw: string;
  assignedCategory: string;
  status:
    | "assigned"
    | "forwarded_to_unit"
    | "in_progress"
    | "completed"
    | "reviewed"
    | "returned_for_edit";
  assignedDate: string;
  dueDate: string;
  editComments?: string;
  sectionsToEdit?: string[];
}

const mockAssignments = {
  air: [
    {
      id: 1,
      name: "ABC Manufacturing Corp",
      address: "123 Industrial Ave, Quezon City",
      assignedLaw: "Clean Air Act",
      assignedCategory: "Manufacturing",
      status: "assigned" as const,
      assignedDate: "2024-01-20",
      dueDate: "2024-02-20",
    },
    {
      id: 2,
      name: "XYZ Chemical Plant",
      address: "456 Chemical St, Makati City",
      assignedLaw: "Clean Air Act",
      assignedCategory: "Chemical Processing",
      status: "completed" as const,
      assignedDate: "2024-01-15",
      dueDate: "2024-02-15",
    },
    {
      id: 4,
      name: "GHI Petrochemical Inc.",
      address: "789 Industrial Park, Cebu City",
      assignedLaw: "Clean Air Act",
      assignedCategory: "Petrochemical",
      status: "returned_for_edit" as const,
      assignedDate: "2024-02-01",
      dueDate: "2024-03-01",
      editComments:
        "Please update emission levels based on the new guidelines.",
      sectionsToEdit: ["Emissions", "Waste Management"],
    },
  ],
  water: [
    {
      id: 3,
      name: "DEF Textile Mills",
      address: "789 Textile Rd, Pasig City",
      assignedLaw: "Clean Water Act",
      assignedCategory: "Textile",
      status: "in_progress" as const,
      assignedDate: "2024-01-18",
      dueDate: "2024-02-18",
    },
  ],
  eia: [],
};

export default function SectionChiefInterface() {
  const [activeTab, setActiveTab] = useState("air");
  const [assignments, setAssignments] = useState(mockAssignments);
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<AssignedEstablishment | null>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      assigned: "secondary",
      forwarded_to_unit: "default",
      in_progress: "default",
      completed: "outline",
      reviewed: "default",
      returned_for_edit: "destructive",
    } as const;

    const labels = {
      assigned: "Assigned",
      forwarded_to_unit: "Forwarded to Unit",
      in_progress: "In Progress",
      completed: "Completed",
      reviewed: "Reviewed",
      returned_for_edit: "Returned for Edit",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleForwardToUnit = (establishmentId: number) => {
    const updatedAssignments = { ...assignments };
    const currentList =
      updatedAssignments[activeTab as keyof typeof assignments];

    const updatedList = currentList.map((est) =>
      est.id === establishmentId
        ? { ...est, status: "forwarded_to_unit" as const }
        : est
    );

    updatedAssignments[activeTab as keyof typeof assignments] = updatedList;
    setAssignments(updatedAssignments);
    toast.success("Assignment forwarded to Unit Head");
  };

  const handleReviewCompleted = (establishmentId: number) => {
    const updatedAssignments = { ...assignments };
    const currentList =
      updatedAssignments[activeTab as keyof typeof assignments];

    const updatedList = currentList.map((est) =>
      est.id === establishmentId ? { ...est, status: "reviewed" as const } : est
    );

    updatedAssignments[activeTab as keyof typeof assignments] = updatedList;
    setAssignments(updatedAssignments);
    toast.success("Inspection reviewed and forwarded to Division Chief");
  };

  const getCurrentAssignments = () =>
    assignments[activeTab as keyof typeof assignments] || [];

  if (selectedEstablishment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Establishment Details</h2>
          <Button
            variant="outline"
            onClick={() => setSelectedEstablishment(null)}
          >
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedEstablishment.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">
                  Establishment Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedEstablishment.name}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedEstablishment.address}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {selectedEstablishment.assignedCategory}
                  </p>
                  <p>
                    <strong>Applicable Law:</strong>{" "}
                    {selectedEstablishment.assignedLaw}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Assignment Details</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedEstablishment.status)}
                  </p>
                  <p>
                    <strong>Assigned Date:</strong>{" "}
                    {new Date(
                      selectedEstablishment.assignedDate
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {new Date(
                      selectedEstablishment.dueDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {selectedEstablishment.status === "assigned" && (
                <Button
                  onClick={() => handleForwardToUnit(selectedEstablishment.id)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Forward to Unit Head
                </Button>
              )}
              {selectedEstablishment.status === "completed" && (
                <Button
                  onClick={() =>
                    handleReviewCompleted(selectedEstablishment.id)
                  }
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Review & Forward to Division Chief
                </Button>
              )}
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
          <CardTitle>Section Chief - Assigned Establishments</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="air">Air Quality</TabsTrigger>
              <TabsTrigger value="water">Water Quality</TabsTrigger>
              <TabsTrigger value="eia">EIA</TabsTrigger>
            </TabsList>

            <TabsContent value="air" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Air Quality Monitoring Assignments
                </h3>
                <Badge variant="outline">
                  {getCurrentAssignments().length} establishments
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Establishment</TableHead>
                    <TableHead>Assigned Law</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCurrentAssignments().map((establishment) => (
                    <TableRow key={establishment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {establishment.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {establishment.address}
                          </div>
                          {establishment.status === "returned_for_edit" &&
                            establishment.editComments && (
                              <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-400 rounded">
                                <div className="flex items-center">
                                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                                  <strong className="text-red-800">
                                    Edit Required
                                  </strong>
                                </div>
                                <p className="text-red-700 text-sm mt-1">
                                  {establishment.editComments}
                                </p>
                                {establishment.sectionsToEdit && (
                                  <div className="mt-2">
                                    <strong className="text-red-800 text-xs">
                                      Sections to edit:
                                    </strong>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {establishment.sectionsToEdit.map(
                                        (section) => (
                                          <Badge
                                            key={section}
                                            variant="destructive"
                                            className="text-xs"
                                          >
                                            {section}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>{establishment.assignedLaw}</TableCell>
                      <TableCell>{establishment.assignedCategory}</TableCell>
                      <TableCell>
                        {getStatusBadge(establishment.status)}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`${
                            new Date(establishment.dueDate) < new Date()
                              ? "text-red-600 font-medium"
                              : ""
                          }`}
                        >
                          {new Date(establishment.dueDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedEstablishment(establishment)
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {establishment.status === "assigned" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleForwardToUnit(establishment.id)
                              }
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Forward
                            </Button>
                          )}
                          {establishment.status === "completed" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleReviewCompleted(establishment.id)
                              }
                            >
                              <ArrowRight className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="water" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Water Quality Monitoring Assignments
                </h3>
                <Badge variant="outline">
                  {assignments.water.length} establishments
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Establishment</TableHead>
                    <TableHead>Assigned Law</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.water.map((establishment) => (
                    <TableRow key={establishment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {establishment.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {establishment.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{establishment.assignedLaw}</TableCell>
                      <TableCell>{establishment.assignedCategory}</TableCell>
                      <TableCell>
                        {getStatusBadge(establishment.status)}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`${
                            new Date(establishment.dueDate) < new Date()
                              ? "text-red-600 font-medium"
                              : ""
                          }`}
                        >
                          {new Date(establishment.dueDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedEstablishment(establishment)
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {establishment.status === "assigned" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleForwardToUnit(establishment.id)
                              }
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Forward
                            </Button>
                          )}
                          {establishment.status === "completed" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleReviewCompleted(establishment.id)
                              }
                            >
                              <ArrowRight className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="eia" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  EIA Monitoring Assignments
                </h3>
                <Badge variant="outline">0 establishments</Badge>
              </div>

              <div className="text-center py-8 text-muted-foreground">
                No EIA assignments at this time.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
