"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Flag,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Filter,
  Search,
  Calendar,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import InspectionForm from "@/features/inspection/InspectionForm";

interface InspectionTask {
  id: string;
  establishment: string;
  address: string;
  assignedLaw: string;
  category: string;
  priority: "high" | "medium" | "low";
  status: "not_started" | "in_progress" | "submitted" | "returned";
  assignedDate: string;
  dueDate: string;
  completionPercentage?: number;
  lastUpdated?: string;
  editComments?: string;
}

const mockTasks: InspectionTask[] = [
  {
    id: "INSP-2024-001",
    establishment: "ABC Manufacturing Corp",
    address: "123 Industrial Ave, Quezon City",
    assignedLaw: "Clean Air Act",
    category: "Manufacturing",
    priority: "high",
    status: "in_progress",
    assignedDate: "2024-01-20",
    dueDate: "2024-02-20",
    completionPercentage: 65,
    lastUpdated: "2024-01-28",
  },
  {
    id: "INSP-2024-002",
    establishment: "XYZ Chemical Plant",
    address: "456 Chemical St, Makati City",
    assignedLaw: "Toxic Substances Act",
    category: "Chemical Processing",
    priority: "high",
    status: "not_started",
    assignedDate: "2024-01-22",
    dueDate: "2024-02-10",
  },
  {
    id: "INSP-2024-003",
    establishment: "DEF Textile Mills",
    address: "789 Textile Rd, Pasig City",
    assignedLaw: "Clean Water Act",
    category: "Textile",
    priority: "medium",
    status: "returned",
    assignedDate: "2024-01-15",
    dueDate: "2024-02-05",
    completionPercentage: 40,
    lastUpdated: "2024-01-25",
    editComments:
      "Please update sections 3.2 and 5.1 with latest compliance data",
  },
  {
    id: "INSP-2024-004",
    establishment: "GHI Mining Corp",
    address: "321 Mining Ave, Baguio City",
    assignedLaw: "Environmental Impact Assessment",
    category: "Mining",
    priority: "low",
    status: "submitted",
    assignedDate: "2024-01-10",
    dueDate: "2024-01-30",
    completionPercentage: 100,
    lastUpdated: "2024-01-28",
  },
];

export default function MonitoringPersonnelInterface() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<InspectionTask[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<InspectionTask | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InspectionTask;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Filter tasks based on search, status, and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.establishment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortConfig) return 0;

    // Handle date comparisons
    if (sortConfig.key === "dueDate" || sortConfig.key === "assignedDate") {
      const dateA = new Date(a[sortConfig.key]);
      const dateB = new Date(b[sortConfig.key]);
      return sortConfig.direction === "ascending"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    // Handle number comparisons
    if (sortConfig.key === "completionPercentage") {
      const valA = a[sortConfig.key] || 0;
      const valB = b[sortConfig.key] || 0;
      return sortConfig.direction === "ascending" ? valA - valB : valB - valA;
    }

    // Default string comparison
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const paginatedTasks = sortedTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof InspectionTask) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "warning",
      low: "default",
    } as const;

    const icons = {
      high: <AlertCircle className="w-3 h-3 mr-1" />,
      medium: <Flag className="w-3 h-3 mr-1" />,
      low: <Clock className="w-3 h-3 mr-1" />,
    };

    const labels = {
      high: "High",
      medium: "Medium",
      low: "Low",
    };

    return (
      <Badge
        variant={variants[priority as keyof typeof variants]}
        className="flex items-center"
      >
        {icons[priority as keyof typeof icons]}
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      not_started: "secondary",
      in_progress: "default",
      submitted: "outline",
      returned: "destructive",
    } as const;

    const icons = {
      not_started: <Clock className="w-3 h-3 mr-1" />,
      in_progress: <FileText className="w-3 h-3 mr-1" />,
      submitted: <CheckCircle className="w-3 h-3 mr-1" />,
      returned: <AlertTriangle className="w-3 h-3 mr-1" />,
    };

    const labels = {
      not_started: "Not Started",
      in_progress: "In Progress",
      submitted: "Submitted",
      returned: "Returned",
    };

    return (
      <Badge
        variant={variants[status as keyof typeof variants]}
        className="flex items-center"
      >
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleStartInspection = (task: InspectionTask) => {
    setSelectedTask(task);
    setShowInspectionForm(true);
  };

  const handleSubmitInspection = () => {
    if (!selectedTask) return;

    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              status: "submitted",
              completionPercentage: 100,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : task
      )
    );
    toast.success("Inspection submitted successfully");
    setShowInspectionForm(false);
    setSelectedTask(null);
  };

  const handleSaveDraft = (formData: Record<string, any>) => {
    if (!selectedTask) return;

    setFormData(formData);
    const completion = calculateCompletion(formData);

    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              status: "in_progress",
              completionPercentage: completion,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : task
      )
    );
    toast.info("Inspection draft saved");
    setShowInspectionForm(false);
    setSelectedTask(null);
  };

  const calculateCompletion = (formData: Record<string, any>) => {
    const totalFields = Object.keys(formData).length;
    const completedFields = Object.values(formData).filter(
      (val) => val !== "" && val !== null && val !== undefined
    ).length;
    return Math.min(
      Math.round((completedFields / (totalFields || 1)) * 100, 100)
    );
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (showInspectionForm && selectedTask) {
    return (
      <InspectionForm
        establishmentData={{
          id: selectedTask.id,
          name: selectedTask.establishment,
          address: selectedTask.address,
          assignedLaw: selectedTask.assignedLaw,
          assignedCategory: selectedTask.category,
        }}
        sectionsToEdit={
          selectedTask.status === "returned"
            ? ["Compliance Status", "Findings & Observations"]
            : []
        }
        onComplete={handleSubmitInspection}
        onSaveDraft={handleSaveDraft}
        onCancel={() => setShowInspectionForm(false)}
        initialData={formData}
      />
    );
  }

  if (selectedTask && !showInspectionForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Inspection Task Details</h2>
          <Button variant="outline" onClick={() => setSelectedTask(null)}>
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedTask.establishment}</CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  {getPriorityBadge(selectedTask.priority)}
                  {getStatusBadge(selectedTask.status)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Due in</div>
                <div
                  className={`text-xl font-semibold ${
                    getDaysRemaining(selectedTask.dueDate) < 3
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {getDaysRemaining(selectedTask.dueDate)} days
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">
                  Establishment Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>ID:</strong> {selectedTask.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {selectedTask.establishment}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedTask.address}
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedTask.category}
                  </p>
                  <p>
                    <strong>Assigned Law:</strong> {selectedTask.assignedLaw}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Task Details</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Assigned Date:</strong> {selectedTask.assignedDate}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {selectedTask.dueDate}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {selectedTask.lastUpdated || "N/A"}
                  </p>
                  {selectedTask.completionPercentage !== undefined && (
                    <div className="space-y-1">
                      <p>
                        <strong>Completion:</strong>
                      </p>
                      <Progress value={selectedTask.completionPercentage} />
                      <p className="text-sm text-muted-foreground">
                        {selectedTask.completionPercentage}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedTask.editComments && (
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <h4 className="font-semibold text-yellow-800">
                    Edit Required
                  </h4>
                </div>
                <p className="text-yellow-700 mt-1">
                  {selectedTask.editComments}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setSelectedTask(null)}>
              Back to List
            </Button>
            <Button onClick={() => handleStartInspection(selectedTask)}>
              {selectedTask.status === "returned"
                ? "Continue Editing"
                : "Start Inspection"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Inspection Tasks</CardTitle>
          <p className="text-sm text-muted-foreground">
            {user?.name
              ? `Welcome back, ${user.name}`
              : "Manage your assigned inspections"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inspections..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full">
                  <Flag className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("establishment")}
                >
                  <div className="flex items-center">
                    Establishment
                    {sortConfig?.key === "establishment" ? (
                      sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Assigned Law</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("priority")}
                >
                  <div className="flex items-center">
                    Priority
                    {sortConfig?.key === "priority" ? (
                      sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortConfig?.key === "status" ? (
                      sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("dueDate")}
                >
                  <div className="flex items-center">
                    Due Date
                    {sortConfig?.key === "dueDate" ? (
                      sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="font-medium">{task.establishment}</div>
                      <div className="text-sm text-muted-foreground">
                        {task.id}
                      </div>
                    </TableCell>
                    <TableCell>{task.assignedLaw}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(task.status)}
                        {task.completionPercentage &&
                          task.status === "in_progress" && (
                            <span className="text-xs text-muted-foreground">
                              {task.completionPercentage}%
                            </span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center ${
                          getDaysRemaining(task.dueDate) < 3
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {task.dueDate}
                        <span className="text-xs ml-2 text-muted-foreground">
                          ({getDaysRemaining(task.dueDate)} days)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => setSelectedTask(task)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No inspection tasks found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of{" "}
            {filteredTasks.length} entries
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
