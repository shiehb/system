"use client";

import { useState } from "react";
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
  Eye,
  ArrowRight,
  AlertTriangle,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";

interface Establishment {
  id: number;
  name: string;
  address: string;
  assignedLaw: string;
  assignedCategory: string;
  status: "pending" | "in_review" | "approved" | "returned" | "completed";
  assignedDate: string;
  dueDate: string;
  assignedPersonnel?: string;
  lastUpdated: string;
  editComments?: string;
}

interface SectionChiefInterfaceProps {
  sectionType: "eia_air_water" | "toxic" | "solidwaste";
}

const mockData = {
  eia_air_water: [
    {
      id: 1,
      name: "ABC Manufacturing Corp",
      address: "123 Industrial Ave, Quezon City",
      assignedLaw: "Clean Air Act",
      assignedCategory: "Manufacturing",
      status: "pending",
      assignedDate: "2024-01-20",
      dueDate: "2024-02-20",
      assignedPersonnel: "Maria Santos",
      lastUpdated: "2024-01-22",
    },
    {
      id: 2,
      name: "XYZ Chemical Plant",
      address: "456 Chemical St, Makati City",
      assignedLaw: "Clean Water Act",
      assignedCategory: "Chemical Processing",
      status: "in_review",
      assignedDate: "2024-01-15",
      dueDate: "2024-02-15",
      assignedPersonnel: "Juan Dela Cruz",
      lastUpdated: "2024-01-18",
    },
    {
      id: 3,
      name: "DEF Textile Mills",
      address: "789 Textile Rd, Pasig City",
      assignedLaw: "Environmental Impact Assessment",
      assignedCategory: "Textile",
      status: "approved",
      assignedDate: "2024-01-18",
      dueDate: "2024-02-18",
      assignedPersonnel: "Ana Rodriguez",
      lastUpdated: "2024-01-20",
    },
    {
      id: 4,
      name: "GHI Mining Corp",
      address: "321 Mining Ave, Baguio City",
      assignedLaw: "Environmental Impact Assessment",
      assignedCategory: "Mining",
      status: "returned",
      assignedDate: "2024-01-10",
      dueDate: "2024-02-10",
      assignedPersonnel: "Carlos Mendoza",
      lastUpdated: "2024-01-15",
      editComments: "Please update emission levels",
    },
  ],
  toxic: [
    {
      id: 5,
      name: "JKL Chemical Storage",
      address: "654 Storage St, Cavite City",
      assignedLaw: "Toxic Substances Act",
      assignedCategory: "Chemical Storage",
      status: "completed",
      assignedDate: "2024-01-12",
      dueDate: "2024-02-12",
      assignedPersonnel: "Lisa Garcia",
      lastUpdated: "2024-01-25",
    },
    {
      id: 6,
      name: "PQR Petrochemical",
      address: "987 Petro St, Batangas",
      assignedLaw: "Toxic Substances Act",
      assignedCategory: "Petrochemical",
      status: "pending",
      assignedDate: "2024-01-05",
      dueDate: "2024-02-05",
      lastUpdated: "2024-01-08",
    },
  ],
  solidwaste: [
    {
      id: 7,
      name: "MNO Waste Treatment",
      address: "987 Treatment Rd, Laguna",
      assignedLaw: "Solid Waste Management Act",
      assignedCategory: "Waste Management",
      status: "in_review",
      assignedDate: "2024-01-08",
      dueDate: "2024-02-08",
      assignedPersonnel: "Robert Lim",
      lastUpdated: "2024-01-12",
    },
    {
      id: 8,
      name: "STU Recycling Facility",
      address: "222 Green Ave, Pampanga",
      assignedLaw: "Solid Waste Management Act",
      assignedCategory: "Recycling",
      status: "pending",
      assignedDate: "2024-01-03",
      dueDate: "2024-02-03",
      lastUpdated: "2024-01-05",
    },
  ],
};

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_review", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "returned", label: "Returned" },
  { value: "completed", label: "Completed" },
];

export default function SectionChiefInterface({
  sectionType,
}: SectionChiefInterfaceProps) {
  const [data, setData] = useState<Establishment[]>(mockData[sectionType]);
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Establishment;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data based on search and status
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Establishment) => {
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

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      in_review: "default",
      approved: "default",
      returned: "destructive",
      completed: "outline",
    } as const;

    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      in_review: <FileText className="w-3 h-3 mr-1" />,
      approved: <CheckCircle className="w-3 h-3 mr-1" />,
      returned: <AlertCircle className="w-3 h-3 mr-1" />,
      completed: <CheckCircle className="w-3 h-3 mr-1" />,
    };

    const labels = {
      pending: "Pending",
      in_review: "In Review",
      approved: "Approved",
      returned: "Returned",
      completed: "Completed",
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

  const getSectionTitle = () => {
    switch (sectionType) {
      case "eia_air_water":
        return "EIA/Air/Water Section";
      case "toxic":
        return "Toxic Substances Section";
      case "solidwaste":
        return "Solid Waste Section";
      default:
        return "Section";
    }
  };

  const getSectionDescription = () => {
    switch (sectionType) {
      case "eia_air_water":
        return "Managing Environmental Impact, Air Quality, and Water Quality inspections";
      case "toxic":
        return "Managing Toxic and Hazardous Substances inspections";
      case "solidwaste":
        return "Managing Solid Waste Management inspections";
      default:
        return "";
    }
  };

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      in_review: 0,
      approved: 0,
      returned: 0,
      completed: 0,
    };

    data.forEach((item) => {
      counts[item.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const handleForwardToDivision = (id: number) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, status: "approved" } : item
      )
    );
    toast.success("Inspection forwarded to Division Chief");
  };

  const handleReturnForEdit = (id: number) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, status: "returned" } : item
      )
    );
    toast.info("Inspection returned for editing");
  };

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
                <h3 className="font-semibold mb-3">Inspection Details</h3>
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
                  {selectedEstablishment.assignedPersonnel && (
                    <p>
                      <strong>Assigned Personnel:</strong>{" "}
                      {selectedEstablishment.assignedPersonnel}
                    </p>
                  )}
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(
                      selectedEstablishment.lastUpdated
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {selectedEstablishment.editComments && (
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <h4 className="font-semibold text-yellow-800">
                    Edit Required
                  </h4>
                </div>
                <p className="text-yellow-700 mt-1">
                  {selectedEstablishment.editComments}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              {selectedEstablishment.status === "in_review" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleReturnForEdit(selectedEstablishment.id)
                    }
                    className="text-red-600 border-red-300"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Return for Edit
                  </Button>
                  <Button
                    onClick={() =>
                      handleForwardToDivision(selectedEstablishment.id)
                    }
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Approve & Forward
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>{getSectionTitle()}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {getSectionDescription()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{data.length}</div>
              <div className="text-sm text-muted-foreground">
                Total Assignments
              </div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{statusCounts.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{statusCounts.in_review}</div>
              <div className="text-sm text-muted-foreground">In Review</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{statusCounts.returned}</div>
              <div className="text-sm text-muted-foreground">Returned</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{statusCounts.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Establishment Inspections</CardTitle>
              <p className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {data.length} inspections
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="Search establishments..."
                className="w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center">
                    Establishment
                    {sortConfig?.key === "name" ? (
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
                <TableHead>Category</TableHead>
                <TableHead>Assigned Law</TableHead>
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
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.address}
                      </div>
                    </TableCell>
                    <TableCell>{item.assignedCategory}</TableCell>
                    <TableCell>{item.assignedLaw}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div
                        className={`${
                          new Date(item.dueDate) < new Date() &&
                          item.status !== "completed"
                            ? "text-red-600 font-medium"
                            : ""
                        }`}
                      >
                        {new Date(item.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEstablishment(item)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {item.status === "in_review" && (
                          <Button
                            size="sm"
                            onClick={() => handleForwardToDivision(item.id)}
                          >
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Forward
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No establishments found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
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
