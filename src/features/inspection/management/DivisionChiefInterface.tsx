"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Download,
  BarChart2,
  Search,
  Send,
  ArrowRight,
  AlertTriangle,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BarChart, PieChart } from "recharts";

interface Report {
  id: string;
  section: "eia_air_water" | "toxic" | "solidwaste";
  establishment: string;
  submittedBy: string;
  submissionDate: string;
  status: "pending_review" | "under_revision" | "approved" | "returned";
  reviewDeadline: string;
  lastUpdated: string;
  complianceScore?: number;
  issuesIdentified?: string[];
  feedback?: string;
}

interface SummaryMetrics {
  totalReports: number;
  pendingReview: number;
  underRevision: number;
  approved: number;
  averageCompletionTime: string;
  commonIssues: { issue: string; count: number }[];
  complianceTrends: { month: string; score: number }[];
}

const mockReports: Report[] = [
  {
    id: "EIA-2024-001",
    section: "eia_air_water",
    establishment: "ABC Manufacturing Corp",
    submittedBy: "Maria Santos",
    submissionDate: "2024-01-15",
    status: "approved",
    reviewDeadline: "2024-01-25",
    lastUpdated: "2024-01-18",
    complianceScore: 92,
    issuesIdentified: ["Incomplete emissions data"],
    feedback: "Please ensure all emissions data is included in future reports",
  },
  {
    id: "TOX-2024-002",
    section: "toxic",
    establishment: "XYZ Chemical Plant",
    submittedBy: "Juan Dela Cruz",
    submissionDate: "2024-01-18",
    status: "under_revision",
    reviewDeadline: "2024-01-28",
    lastUpdated: "2024-01-22",
    complianceScore: 78,
    issuesIdentified: [
      "Missing safety protocols",
      "Incomplete waste disposal records",
    ],
    feedback: "Please address all safety protocol documentation",
  },
  {
    id: "SW-2024-003",
    section: "solidwaste",
    establishment: "MNO Waste Treatment",
    submittedBy: "Ana Rodriguez",
    submissionDate: "2024-01-20",
    status: "pending_review",
    reviewDeadline: "2024-01-30",
    lastUpdated: "2024-01-20",
    complianceScore: undefined,
  },
  {
    id: "EIA-2024-004",
    section: "eia_air_water",
    establishment: "GHI Mining Corp",
    submittedBy: "Carlos Mendoza",
    submissionDate: "2024-01-22",
    status: "returned",
    reviewDeadline: "2024-02-01",
    lastUpdated: "2024-01-25",
    complianceScore: 65,
    issuesIdentified: ["Incomplete EIA", "Missing mitigation plans"],
    feedback: "Complete all sections and resubmit with mitigation plans",
  },
];

const mockMetrics: SummaryMetrics = {
  totalReports: 24,
  pendingReview: 3,
  underRevision: 5,
  approved: 16,
  averageCompletionTime: "4.2 days",
  commonIssues: [
    { issue: "Incomplete documentation", count: 12 },
    { issue: "Missing compliance data", count: 8 },
    { issue: "Late submissions", count: 5 },
    { issue: "Formatting errors", count: 3 },
  ],
  complianceTrends: [
    { month: "Oct 2023", score: 78 },
    { month: "Nov 2023", score: 82 },
    { month: "Dec 2023", score: 85 },
    { month: "Jan 2024", score: 88 },
  ],
};

export default function DivisionChiefInterface() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [feedback, setFeedback] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Report;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [metrics, setMetrics] = useState<SummaryMetrics>(mockMetrics);
  const itemsPerPage = 5;

  // Filter reports based on search, status, and section
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

  const getStatusBadge = (status: string) => {
    const variants = {
      pending_review: "secondary",
      under_revision: "default",
      approved: "default",
      returned: "destructive",
    } as const;

    const icons = {
      pending_review: <Clock className="w-3 h-3 mr-1" />,
      under_revision: <FileText className="w-3 h-3 mr-1" />,
      approved: <CheckCircle className="w-3 h-3 mr-1" />,
      returned: <AlertCircle className="w-3 h-3 mr-1" />,
    };

    const labels = {
      pending_review: "Pending Review",
      under_revision: "Under Revision",
      approved: "Approved",
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

  const getSectionBadge = (section: string) => {
    const variants = {
      eia_air_water: "default",
      toxic: "destructive",
      solidwaste: "secondary",
    } as const;

    const labels = {
      eia_air_water: "EIA/Air/Water",
      toxic: "Toxic Substances",
      solidwaste: "Solid Waste",
    };

    return (
      <Badge variant={variants[section as keyof typeof variants]}>
        {labels[section as keyof typeof labels]}
      </Badge>
    );
  };

  const handleApproveReport = (id: string) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, status: "approved" } : report
      )
    );
    toast.success("Report approved successfully");
    setSelectedReport(null);
  };

  const handleReturnReport = () => {
    if (!selectedReport || !feedback) {
      toast.error("Please provide feedback before returning the report");
      return;
    }

    setReports(
      reports.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              status: "returned",
              feedback: feedback,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : report
      )
    );
    toast.info("Report returned for revision");
    setSelectedReport(null);
    setFeedback("");
  };

  const handleRequestRevision = (id: string) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, status: "under_revision" } : report
      )
    );
    toast.info("Revision requested for report");
  };

  const generateComplianceReport = () => {
    toast.success("Compliance report generated and downloaded");
    // In a real app, this would trigger a PDF/download
  };

  const generatePerformanceReport = () => {
    toast.success("Performance report generated and downloaded");
    // In a real app, this would trigger a PDF/download
  };

  if (selectedReport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Report Review - {selectedReport.id}
          </h2>
          <Button variant="outline" onClick={() => setSelectedReport(null)}>
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedReport.establishment}</CardTitle>
            <div className="flex items-center space-x-4">
              <div>{getSectionBadge(selectedReport.section)}</div>
              <div>{getStatusBadge(selectedReport.status)}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Report Details</h3>
                <p>
                  <strong>Submitted by:</strong> {selectedReport.submittedBy}
                </p>
                <p>
                  <strong>Submission date:</strong>{" "}
                  {selectedReport.submissionDate}
                </p>
                <p>
                  <strong>Review deadline:</strong>{" "}
                  {selectedReport.reviewDeadline}
                </p>
                <p>
                  <strong>Last updated:</strong> {selectedReport.lastUpdated}
                </p>
                {selectedReport.complianceScore && (
                  <p>
                    <strong>Compliance score:</strong>{" "}
                    {selectedReport.complianceScore}/100
                  </p>
                )}
              </div>

              {selectedReport.issuesIdentified &&
                selectedReport.issuesIdentified.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Identified Issues</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedReport.issuesIdentified.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedReport.feedback && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Previous Feedback</h3>
                  <div className="p-3 bg-gray-50 rounded">
                    {selectedReport.feedback}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Your Feedback</h3>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback for the section head..."
                className="min-h-[150px]"
              />
            </div>

            <div className="flex justify-end space-x-3">
              {selectedReport.status === "pending_review" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleRequestRevision(selectedReport.id)}
                  >
                    Request Revision
                  </Button>
                  <Button variant="destructive" onClick={handleReturnReport}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Return Report
                  </Button>
                  <Button
                    onClick={() => handleApproveReport(selectedReport.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Report
                  </Button>
                </>
              )}
              {selectedReport.status === "under_revision" && (
                <>
                  <Button variant="destructive" onClick={handleReturnReport}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Return Report
                  </Button>
                  <Button
                    onClick={() => handleApproveReport(selectedReport.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Report
                  </Button>
                </>
              )}
              {selectedReport.status === "returned" && (
                <Button onClick={() => handleApproveReport(selectedReport.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Report
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
      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalReports}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingReview}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Under Revision
            </CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.underRevision}</div>
            <p className="text-xs text-muted-foreground">
              Being revised by sections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Completion
            </CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageCompletionTime}
            </div>
            <p className="text-xs text-muted-foreground">Per report</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Compliance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">
                Compliance Trend (Last 6 Months)
              </h3>
              <div className="h-[300px]">
                <BarChart
                  data={metrics.complianceTrends}
                  xKey="month"
                  yKey="score"
                  color="#3b82f6"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Common Issues</h3>
              <div className="h-[300px]">
                <PieChart
                  data={metrics.commonIssues}
                  nameKey="issue"
                  valueKey="count"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-3">
          <Button variant="outline" onClick={generateComplianceReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Compliance Report
          </Button>
          <Button variant="outline" onClick={generatePerformanceReport}>
            <BarChart2 className="w-4 h-4 mr-2" />
            Export Performance Report
          </Button>
        </CardFooter>
      </Card> */}

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Section Reports</CardTitle>
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
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="under_revision">Under Revision</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
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
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("reviewDeadline")}
                >
                  <div className="flex items-center">
                    Deadline
                    {sortConfig?.key === "reviewDeadline" ? (
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
                      <div
                        className={`${
                          new Date(report.reviewDeadline) < new Date() &&
                          report.status !== "approved"
                            ? "text-red-600 font-medium"
                            : ""
                        }`}
                      >
                        {report.reviewDeadline}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        {report.status === "pending_review" && (
                          <Button
                            size="sm"
                            onClick={() => handleRequestRevision(report.id)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Request Rev
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
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
