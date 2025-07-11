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
} from "@/components/ui/select";
import {
  Eye,
  CheckCircle,
  Filter,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";
import type { Report } from "@/types/";
import { getStatusBadge, getSectionBadge } from "@/utils/badges";

interface ReportsTableProps {
  reports: Report[];
  onViewReport: (report: Report) => void;
  onReviewReport: (report: Report) => void;
}

export function ReportsTable({
  reports,
  onViewReport,
  onReviewReport,
}: ReportsTableProps) {
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

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-gray-900">
              Section Reports
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredReports.length} of {reports.length} reports
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                className="w-full md:w-64 pl-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 border-gray-300">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Status</span>
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
              <SelectTrigger className="w-full md:w-48 border-gray-300">
                <span>All Sections</span>
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
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead
                className="cursor-pointer hover:bg-gray-100 transition-colors"
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
                    <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead>Establishment</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100 transition-colors"
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
                    <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100 transition-colors"
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
                    <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReports.length > 0 ? (
              paginatedReports.map((report) => (
                <TableRow
                  key={report.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-blue-600">
                    {report.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {report.establishment}
                  </TableCell>
                  <TableCell>{getSectionBadge(report.section)}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewReport(report)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {report.status === "done" && (
                        <Button
                          size="sm"
                          onClick={() => onReviewReport(report)}
                          className="bg-green-600 hover:bg-green-700 text-white"
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
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Search className="w-8 h-8 text-gray-300" />
                    <p>No reports found matching your criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50/50 border-t">
        <div className="text-sm text-gray-600">
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
            className="border-gray-300"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="border-gray-300"
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
