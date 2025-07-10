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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Eye, UserPlus, Send, FileText } from "lucide-react";
import { toast } from "sonner";

interface Personnel {
  id: number;
  name: string;
  position: string;
  specialization: string;
  workload: number;
  maxCapacity: number;
}

interface Assignment {
  id: number;
  name: string;
  address: string;
  assignedLaw: string;
  assignedCategory: string;
  status:
    | "received"
    | "assigned_to_personnel"
    | "in_progress"
    | "completed"
    | "forwarded";
  receivedDate: string;
  dueDate: string;
  assignedPersonnel?: Personnel;
}

const mockPersonnel: Personnel[] = [
  {
    id: 1,
    name: "Maria Santos",
    position: "Air Quality Monitoring Personnel",
    specialization: "Air Quality",
    workload: 3,
    maxCapacity: 5,
  },
  {
    id: 2,
    name: "Juan Dela Cruz",
    position: "Air Quality Monitoring Personnel",
    specialization: "Air Quality",
    workload: 2,
    maxCapacity: 5,
  },
  {
    id: 3,
    name: "Ana Rodriguez",
    position: "Water Quality Monitoring Personnel",
    specialization: "Water Quality",
    workload: 4,
    maxCapacity: 5,
  },
  {
    id: 4,
    name: "Carlos Mendoza",
    position: "EIA Monitoring Personnel",
    specialization: "Environmental Impact Assessment",
    workload: 2,
    maxCapacity: 4,
  },
  {
    id: 5,
    name: "Lisa Garcia",
    position: "EIA Monitoring Personnel",
    specialization: "Environmental Impact Assessment",
    workload: 3,
    maxCapacity: 4,
  },
];

const mockAssignments: Assignment[] = [
  {
    id: 1,
    name: "ABC Manufacturing Corp",
    address: "123 Industrial Ave, Quezon City",
    assignedLaw: "Clean Air Act",
    assignedCategory: "Manufacturing",
    status: "received",
    receivedDate: "2024-01-20",
    dueDate: "2024-02-20",
  },
  {
    id: 2,
    name: "XYZ Chemical Plant",
    address: "456 Chemical St, Makati City",
    assignedLaw: "Clean Air Act",
    assignedCategory: "Chemical Processing",
    status: "completed",
    receivedDate: "2024-01-15",
    dueDate: "2024-02-15",
    assignedPersonnel: mockPersonnel[0],
  },
  {
    id: 3,
    name: "DEF Textile Mills",
    address: "789 Textile Rd, Pasig City",
    assignedLaw: "Clean Water Act",
    assignedCategory: "Textile",
    status: "received",
    receivedDate: "2024-01-18",
    dueDate: "2024-02-18",
  },
  {
    id: 4,
    name: "GHI Mining Corp",
    address: "321 Mining Ave, Baguio City",
    assignedLaw: "Environmental Impact Assessment",
    assignedCategory: "Mining",
    status: "completed",
    receivedDate: "2024-01-10",
    dueDate: "2024-02-10",
    assignedPersonnel: mockPersonnel[3],
  },
];

const inspectionSections = [
  "General Information",
  "Purpose of Inspection",
  "Compliance Status",
  "Summary of Compliance",
  "Findings & Observations",
  "Recommendations",
];

export default function UnitHeadInterface() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [personnel] = useState(mockPersonnel);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showAssignmentForm, setShowAssignmentForm] =
    useState<Assignment | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<Assignment | null>(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState<string>("");

  const getStatusBadge = (status: string) => {
    const variants = {
      received: "secondary",
      assigned_to_personnel: "default",
      in_progress: "default",
      completed: "outline",
      forwarded: "default",
    } as const;

    const labels = {
      received: "Received",
      assigned_to_personnel: "Assigned to Personnel",
      in_progress: "In Progress",
      completed: "Completed",
      forwarded: "Forwarded",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getWorkloadBadge = (workload: number, maxCapacity: number) => {
    const percentage = (workload / maxCapacity) * 100;
    let variant: "default" | "secondary" | "destructive" = "default";

    if (percentage >= 80) variant = "destructive";
    else if (percentage >= 60) variant = "secondary";

    return (
      <Badge variant={variant}>
        {workload}/{maxCapacity}
      </Badge>
    );
  };

  const getPersonnelByLaw = (law: string) => {
    const lawMapping: { [key: string]: string } = {
      "Clean Air Act": "Air Quality",
      "Clean Water Act": "Water Quality",
      "Environmental Impact Assessment": "Environmental Impact Assessment",
    };

    const specialization = lawMapping[law];
    return personnel.filter((p) => p.specialization === specialization);
  };

  const handleAssignPersonnel = () => {
    if (!showAssignmentForm || !selectedPersonnel) {
      toast.error("Please select personnel");
      return;
    }

    const selectedPerson = personnel.find(
      (p) => p.id.toString() === selectedPersonnel
    );
    if (!selectedPerson) return;

    const updatedAssignments = assignments.map((assignment) =>
      assignment.id === showAssignmentForm.id
        ? {
            ...assignment,
            status: "assigned_to_personnel" as const,
            assignedPersonnel: selectedPerson,
          }
        : assignment
    );

    setAssignments(updatedAssignments);
    setShowAssignmentForm(null);
    setSelectedPersonnel("");
    toast.success(`Assignment forwarded to ${selectedPerson.name}`);
  };

  const handleForwardCompleted = (assignmentId: number) => {
    const updatedAssignments = assignments.map((assignment) =>
      assignment.id === assignmentId
        ? { ...assignment, status: "forwarded" as const }
        : assignment
    );

    setAssignments(updatedAssignments);
    toast.success("Completed inspection forwarded to Section Chief");
  };

  if (selectedAssignment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Assignment Details</h2>
          <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedAssignment.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">
                  Establishment Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedAssignment.name}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedAssignment.address}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {selectedAssignment.assignedCategory}
                  </p>
                  <p>
                    <strong>Applicable Law:</strong>{" "}
                    {selectedAssignment.assignedLaw}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Assignment Details</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedAssignment.status)}
                  </p>
                  <p>
                    <strong>Received Date:</strong>{" "}
                    {new Date(
                      selectedAssignment.receivedDate
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                  </p>
                  {selectedAssignment.assignedPersonnel && (
                    <p>
                      <strong>Assigned Personnel:</strong>{" "}
                      {selectedAssignment.assignedPersonnel.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {selectedAssignment.status === "received" && (
                <Button
                  onClick={() => setShowAssignmentForm(selectedAssignment)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Personnel
                </Button>
              )}
              {selectedAssignment.status === "completed" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(selectedAssignment)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Review Form
                  </Button>
                  <Button
                    onClick={() =>
                      handleForwardCompleted(selectedAssignment.id)
                    }
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Forward to Section Chief
                  </Button>
                </>
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
                    <strong>Category:</strong> {showReviewForm.assignedCategory}
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
                  {showReviewForm.assignedPersonnel && (
                    <p>
                      <strong>Assigned Personnel:</strong>{" "}
                      {showReviewForm.assignedPersonnel.name}
                    </p>
                  )}
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

  if (showAssignmentForm) {
    const availablePersonnel = getPersonnelByLaw(
      showAssignmentForm.assignedLaw
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Assign Personnel - {showAssignmentForm.name}
          </h2>
          <Button variant="outline" onClick={() => setShowAssignmentForm(null)}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Monitoring Personnel</CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing personnel specialized in: {showAssignmentForm.assignedLaw}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">
                Available Personnel
              </Label>
              <Select onValueChange={setSelectedPersonnel}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select personnel to assign" />
                </SelectTrigger>
                <SelectContent>
                  {availablePersonnel.map((person) => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {person.name} - {person.position}
                        </span>
                        <span className="ml-2">
                          Workload: {person.workload}/{person.maxCapacity}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">
                Personnel Workload Overview
              </Label>
              <div className="mt-2 space-y-2">
                {availablePersonnel.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {person.position}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Current Workload:</span>
                      {getWorkloadBadge(person.workload, person.maxCapacity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAssignmentForm(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignPersonnel}>Assign Personnel</Button>
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
          <CardTitle>Unit Head - Assignment Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Managing specialized personnel for Air Quality, Water Quality, and
            EIA monitoring
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Received Assignments</h3>
              <Badge variant="outline">{assignments.length} assignments</Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Establishment</TableHead>
                  <TableHead>Assigned Law</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Personnel</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assignment.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{assignment.assignedLaw}</TableCell>
                    <TableCell>{assignment.assignedCategory}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell>
                      {assignment.assignedPersonnel
                        ? assignment.assignedPersonnel.name
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`${
                          new Date(assignment.dueDate) < new Date()
                            ? "text-red-600 font-medium"
                            : ""
                        }`}
                      >
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {assignment.status === "received" && (
                          <Button
                            size="sm"
                            onClick={() => setShowAssignmentForm(assignment)}
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assign Personnel
                          </Button>
                        )}
                        {assignment.status === "completed" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowReviewForm(assignment)}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleForwardCompleted(assignment.id)
                              }
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Forward
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
