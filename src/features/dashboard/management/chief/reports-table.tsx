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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Filter,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";

interface Report {
  id: string;
  section: "eia_air_water" | "toxic" | "solidwaste";
  establishment: string;
  submittedBy: string;
  submissionDate: string;
  status:
    | "not_started"
    | "pending"
    | "started"
    | "in_progress"
    | "done"
    | "approved";
  lastUpdated: string;
  complianceScore?: number;
}

const mockReports: Report[] = [
  {
    id: "EIA-2024-001",
    section: "eia_air_water",
    establishment: "ABC Manufacturing Corp",
    submittedBy: "Maria Santos",
    submissionDate: "2024-01-15",
    status: "started",
    lastUpdated: "2024-01-18",
    complianceScore: 92,
  },
  {
    id: "TOX-2024-002",
    section: "toxic",
    establishment: "XYZ Chemical Plant",
    submittedBy: "Juan Dela Cruz",
    submissionDate: "2024-01-18",
    status: "pending",
    lastUpdated: "2024-01-22",
    complianceScore: 78,
  },
  {
    id: "SW-2024-003",
    section: "solidwaste",
    establishment: "MNO Waste Treatment",
    submittedBy: "Ana Rodriguez",
    submissionDate: "2024-01-20",
    status: "not_started",
    lastUpdated: "2024-01-20",
  },
  {
    id: "EIA-2024-004",
    section: "eia_air_water",
    establishment: "GHI Mining Corp",
    submittedBy: "Carlos Mendoza",
    submissionDate: "2024-01-22",
    status: "in_progress",
    lastUpdated: "2024-01-25",
    complianceScore: 65,
  },
  {
    id: "EIA-2024-005",
    section: "eia_air_water",
    establishment: "DEF Power Plant",
    submittedBy: "Luis Gomez",
    submissionDate: "2024-01-24",
    status: "done",
    lastUpdated: "2024-01-28",
    complianceScore: 88,
  },
];

export default function ReportsTable() {
  const [reports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Report;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.establishment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesSection =
      sectionFilter === "all" || report.section === sectionFilter;
    return matchesSearch && matchesStatus && matchesSection;
  });

  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Report) => {
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

  const getStatusBadge = (status: Report["status"]) => {
    const variantMap = {
      not_started: "secondary",
      pending: "default",
      started: "default",
      in_progress: "destructive",
      done: "secondary",
      approved: "success",
    };

    const iconMap = {
      not_started: <Clock className="w-3 h-3 mr-1" />,
      pending: <FileText className="w-3 h-3 mr-1" />,
      started: <CheckCircle className="w-3 h-3 mr-1" />,
      in_progress: <AlertCircle className="w-3 h-3 mr-1" />,
      done: <CheckCircle className="w-3 h-3 mr-1" />,
      approved: <CheckCircle className="w-3 h-3 mr-1" />,
    };

    const labelMap = {
      not_started: "Not Started",
      pending: "Pending Review",
      started: "Started",
      in_progress: "In Progress",
      done: "Completed",
      approved: "Approved",
    };

    return (
      <Badge variant={variantMap[status]} className="flex items-center">
        {iconMap[status]}
        {labelMap[status]}
      </Badge>
    );
  };

  const getSectionBadge = (section: Report["section"]) => {
    const variantMap = {
      eia_air_water: "default",
      toxic: "destructive",
      solidwaste: "secondary",
    };

    const labelMap = {
      eia_air_water: "EIA/Air/Water",
      toxic: "Toxic Substances",
      solidwaste: "Solid Waste",
    };

    return <Badge variant={variantMap[section]}>{labelMap[section]}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Inspection Management</h2>
        <p className="text-muted-foreground">
          Manage and review all section Inspections
        </p>
      </div> */}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Section Inspection</CardTitle>
              <p className="text-sm text-muted-foreground">
                Showing {filteredReports.length} of {reports.length} reports
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="w-full md:w-64 pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="started">Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Completed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="eia_air_water">EIA/Air/Water</SelectItem>
                  <SelectItem value="toxic">Toxic Substances</SelectItem>
                  <SelectItem value="solidwaste">Solid Waste</SelectItem>
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
                  onClick={() => requestSort("id")}
                >
                  <div className="flex items-center">
                    Report ID
                    {sortConfig?.key === "id" ? (
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
                <TableHead>Establishment</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("section")}
                >
                  <div className="flex items-center">
                    Section
                    {sortConfig?.key === "section" ? (
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.length > 0 ? (
                paginatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.establishment}</TableCell>
                    <TableCell>{getSectionBadge(report.section)}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {report.status === "done" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No reports found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredReports.length)} of{" "}
            {filteredReports.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
