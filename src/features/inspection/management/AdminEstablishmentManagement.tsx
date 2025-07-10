"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Download,
  FileText,
  Edit,
  UserCheck,
  MapPin,
  Paperclip,
  MoreHorizontal,
  Plus,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/useAuth";

interface EstablishmentAssignment {
  id: number;
  establishment: {
    id: number;
    name: string;
    address: string;
    category: string;
    coordinates?: { lat: number; lng: number };
    businessType: string;
    yearEstablished?: number;
  };
  assignedInspectors: {
    id: number;
    name: string;
    role: string;
    email: string;
    avatar?: string;
  }[];
  inspectionStatus:
    | "not_started"
    | "in_progress"
    | "completed"
    | "overdue"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedDate: string;
  dueDate: string;
  lastInspectionDate?: string;
  notes: string;
  attachments: {
    id: number;
    name: string;
    type: string;
    size: number;
    uploadedBy: string;
    uploadedAt: string;
    url: string;
  }[];
  complianceScore?: number;
  violations: number;
  applicableLaws: string[];
  createdBy: {
    id: number;
    name: string;
    role: string;
  };
  lastUpdated: string;
}

interface Inspector {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  workload: number;
  avatar?: string;
}

// Mock data for demonstration
const mockEstablishments: EstablishmentAssignment[] = [
  {
    id: 1,
    establishment: {
      id: 101,
      name: "ABC Manufacturing Corp",
      address: "123 Industrial Ave, Quezon City, Metro Manila",
      category: "Manufacturing",
      coordinates: { lat: 14.676, lng: 121.0437 },
      businessType: "Chemical Manufacturing",
      yearEstablished: 2015,
    },
    assignedInspectors: [
      {
        id: 1,
        name: "Maria Santos",
        role: "Senior Inspector",
        email: "maria.santos@denr.gov.ph",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: 2,
        name: "Juan Dela Cruz",
        role: "Environmental Specialist",
        email: "juan.delacruz@denr.gov.ph",
      },
    ],
    inspectionStatus: "in_progress",
    priority: "high",
    assignedDate: "2024-01-15",
    dueDate: "2024-02-15",
    lastInspectionDate: "2024-01-20",
    notes:
      "High priority due to previous violations. Focus on air quality monitoring.",
    attachments: [
      {
        id: 1,
        name: "Previous_Inspection_Report.pdf",
        type: "application/pdf",
        size: 2048576,
        uploadedBy: "Admin User",
        uploadedAt: "2024-01-10",
        url: "#",
      },
      {
        id: 2,
        name: "Compliance_Checklist.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 512000,
        uploadedBy: "Maria Santos",
        uploadedAt: "2024-01-18",
        url: "#",
      },
    ],
    complianceScore: 75,
    violations: 3,
    applicableLaws: ["Clean Air Act", "Environmental Impact Assessment"],
    createdBy: {
      id: 1,
      name: "Admin User",
      role: "Administrator",
    },
    lastUpdated: "2024-01-22",
  },
  {
    id: 2,
    establishment: {
      id: 102,
      name: "XYZ Textile Mills",
      address: "456 Textile St, Makati City, Metro Manila",
      category: "Textile",
      coordinates: { lat: 14.5547, lng: 121.0244 },
      businessType: "Textile Manufacturing",
      yearEstablished: 2010,
    },
    assignedInspectors: [
      {
        id: 3,
        name: "Ana Rodriguez",
        role: "Water Quality Inspector",
        email: "ana.rodriguez@denr.gov.ph",
      },
    ],
    inspectionStatus: "overdue",
    priority: "urgent",
    assignedDate: "2024-01-05",
    dueDate: "2024-01-25",
    notes: "Overdue inspection. Immediate action required.",
    attachments: [],
    violations: 1,
    applicableLaws: ["Clean Water Act", "Solid Waste Management Act"],
    createdBy: {
      id: 1,
      name: "Admin User",
      role: "Administrator",
    },
    lastUpdated: "2024-01-20",
  },
  {
    id: 3,
    establishment: {
      id: 103,
      name: "DEF Mining Corporation",
      address: "789 Mining Rd, Baguio City, Benguet",
      category: "Mining",
      coordinates: { lat: 16.4023, lng: 120.596 },
      businessType: "Gold Mining",
      yearEstablished: 2008,
    },
    assignedInspectors: [
      {
        id: 4,
        name: "Carlos Mendoza",
        role: "EIA Specialist",
        email: "carlos.mendoza@denr.gov.ph",
      },
      {
        id: 5,
        name: "Lisa Garcia",
        role: "Mining Inspector",
        email: "lisa.garcia@denr.gov.ph",
      },
    ],
    inspectionStatus: "completed",
    priority: "medium",
    assignedDate: "2024-01-01",
    dueDate: "2024-01-31",
    lastInspectionDate: "2024-01-28",
    notes: "Completed inspection with minor recommendations.",
    attachments: [
      {
        id: 3,
        name: "Final_Inspection_Report.pdf",
        type: "application/pdf",
        size: 3145728,
        uploadedBy: "Carlos Mendoza",
        uploadedAt: "2024-01-29",
        url: "#",
      },
    ],
    complianceScore: 92,
    violations: 0,
    applicableLaws: ["Environmental Impact Assessment", "Mining Act"],
    createdBy: {
      id: 1,
      name: "Admin User",
      role: "Administrator",
    },
    lastUpdated: "2024-01-29",
  },
];

const mockInspectors: Inspector[] = [
  {
    id: 1,
    name: "Maria Santos",
    email: "maria.santos@denr.gov.ph",
    role: "Senior Inspector",
    department: "Air Quality",
    workload: 5,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Juan Dela Cruz",
    email: "juan.delacruz@denr.gov.ph",
    role: "Environmental Specialist",
    department: "EIA",
    workload: 3,
  },
  {
    id: 3,
    name: "Ana Rodriguez",
    email: "ana.rodriguez@denr.gov.ph",
    role: "Water Quality Inspector",
    department: "Water Quality",
    workload: 4,
  },
  {
    id: 4,
    name: "Carlos Mendoza",
    email: "carlos.mendoza@denr.gov.ph",
    role: "EIA Specialist",
    department: "EIA",
    workload: 2,
  },
  {
    id: 5,
    name: "Lisa Garcia",
    email: "lisa.garcia@denr.gov.ph",
    role: "Mining Inspector",
    department: "Mining",
    workload: 6,
  },
];

export default function AdminEstablishmentManagement() {
  const { user } = useAuth();
  const [establishments, setEstablishments] =
    useState<EstablishmentAssignment[]>(mockEstablishments);
  const [inspectors] = useState<Inspector[]>(mockInspectors);
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<EstablishmentAssignment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof EstablishmentAssignment | string;
    direction: "asc" | "desc";
  }>({ key: "lastUpdated", direction: "desc" });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort establishments
  const filteredAndSortedEstablishments = useMemo(() => {
    const filtered = establishments.filter((est) => {
      const matchesSearch =
        est.establishment.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        est.establishment.address
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        est.assignedInspectors.some((inspector) =>
          inspector.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || est.inspectionStatus === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || est.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "all" ||
        est.establishment.category === categoryFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });

    // Sort establishments
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key.includes(".")) {
        const keys = sortConfig.key.split(".");
        aValue = keys.reduce((obj, key) => obj?.[key], a);
        bValue = keys.reduce((obj, key) => obj?.[key], b);
      } else {
        aValue = a[sortConfig.key as keyof EstablishmentAssignment];
        bValue = b[sortConfig.key as keyof EstablishmentAssignment];
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    establishments,
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortConfig,
  ]);

  // Check if user has admin access
  const hasAdminAccess =
    user?.user_level === "administrator" ||
    user?.user_level === "division_chief";

  const getStatusBadge = (status: string) => {
    const config = {
      not_started: {
        variant: "secondary" as const,
        icon: Clock,
        label: "Not Started",
      },
      in_progress: {
        variant: "default" as const,
        icon: RefreshCw,
        label: "In Progress",
      },
      completed: {
        variant: "outline" as const,
        icon: CheckCircle,
        label: "Completed",
      },
      overdue: {
        variant: "destructive" as const,
        icon: AlertTriangle,
        label: "Overdue",
      },
      cancelled: {
        variant: "secondary" as const,
        icon: Trash2,
        label: "Cancelled",
      },
    };

    const {
      variant,
      icon: Icon,
      label,
    } = config[status as keyof typeof config] || config.not_started;

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      low: {
        variant: "outline" as const,
        className: "border-green-500 text-green-700",
      },
      medium: {
        variant: "outline" as const,
        className: "border-yellow-500 text-yellow-700",
      },
      high: {
        variant: "outline" as const,
        className: "border-orange-500 text-orange-700",
      },
      urgent: { variant: "destructive" as const, className: "" },
    };

    const { variant, className } =
      config[priority as keyof typeof config] || config.low;

    return (
      <Badge variant={variant} className={className}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredAndSortedEstablishments.map((est) => est.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEstablishments((prev) =>
        prev.map((est) =>
          selectedItems.includes(est.id)
            ? {
                ...est,
                inspectionStatus: newStatus as any,
                lastUpdated: new Date().toISOString(),
              }
            : est
        )
      );

      setSelectedItems([]);
      toast.success(
        `Updated ${selectedItems.length} establishment(s) status to ${newStatus}`
      );
    } catch (error) {
      toast.error("Failed to update establishment statuses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReassignInspectors = async (
    establishmentId: number,
    inspectorIds: number[]
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const selectedInspectors = inspectors.filter((inspector) =>
        inspectorIds.includes(inspector.id)
      );

      setEstablishments((prev) =>
        prev.map((est) =>
          est.id === establishmentId
            ? {
                ...est,
                assignedInspectors: selectedInspectors.map((inspector) => ({
                  id: inspector.id,
                  name: inspector.name,
                  role: inspector.role,
                  email: inspector.email,
                  avatar: inspector.avatar,
                })),
                lastUpdated: new Date().toISOString(),
              }
            : est
        )
      );

      setIsReassignDialogOpen(false);
      toast.success("Inspectors reassigned successfully");
    } catch (error) {
      toast.error("Failed to reassign inspectors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const csvData = filteredAndSortedEstablishments.map((est) => ({
      "Establishment Name": est.establishment.name,
      Address: est.establishment.address,
      Category: est.establishment.category,
      Status: est.inspectionStatus,
      Priority: est.priority,
      "Assigned Inspectors": est.assignedInspectors
        .map((i) => i.name)
        .join("; "),
      "Due Date": est.dueDate,
      "Compliance Score": est.complianceScore || "N/A",
      Violations: est.violations,
      "Last Updated": est.lastUpdated,
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `establishments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Data exported successfully");
  };

  const getStatistics = () => {
    const total = establishments.length;
    const completed = establishments.filter(
      (est) => est.inspectionStatus === "completed"
    ).length;
    const inProgress = establishments.filter(
      (est) => est.inspectionStatus === "in_progress"
    ).length;
    const overdue = establishments.filter(
      (est) => est.inspectionStatus === "overdue"
    ).length;
    const avgCompliance =
      establishments
        .filter((est) => est.complianceScore)
        .reduce((sum, est) => sum + (est.complianceScore || 0), 0) /
        establishments.filter((est) => est.complianceScore).length || 0;

    return { total, completed, inProgress, overdue, avgCompliance };
  };

  const stats = getStatistics();

  if (!hasAdminAccess) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p>
              You don't have permission to access the administrative
              establishment management interface.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Establishment Management</h1>
          <p className="text-muted-foreground">
            Comprehensive administrative interface for managing establishment
            assignments and inspections
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Establishments
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.inProgress}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Overdue
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.overdue}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Compliance
                </p>
                <p className="text-2xl font-bold">
                  {stats.avgCompliance.toFixed(1)}%
                </p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Establishment Assignments ({filteredAndSortedEstablishments.length})
          </CardTitle>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search establishments, addresses, or inspectors..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Mining">Mining</SelectItem>
                <SelectItem value="Textile">Textile</SelectItem>
                <SelectItem value="Chemical">Chemical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedItems.length} establishment(s) selected
              </span>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleBulkStatusUpdate("in_progress")}
                    >
                      Mark as In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkStatusUpdate("completed")}
                    >
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkStatusUpdate("cancelled")}
                    >
                      Mark as Cancelled
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedItems.length ===
                        filteredAndSortedEstablishments.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("establishment.name")}
                  >
                    <div className="flex items-center">
                      Establishment
                      {sortConfig.key === "establishment.name" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Assigned Inspectors</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("inspectionStatus")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === "inspectionStatus" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("priority")}
                  >
                    <div className="flex items-center">
                      Priority
                      {sortConfig.key === "priority" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("dueDate")}
                  >
                    <div className="flex items-center">
                      Due Date
                      {sortConfig.key === "dueDate" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEstablishments.map((establishment) => (
                  <TableRow key={establishment.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(establishment.id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(establishment.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {establishment.establishment.name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {establishment.establishment.address}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {establishment.establishment.category}
                          </Badge>
                          {establishment.attachments.length > 0 && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Paperclip className="h-3 w-3 mr-1" />
                              {establishment.attachments.length}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {establishment.assignedInspectors.map(
                          (inspector, index) => (
                            <div
                              key={inspector.id}
                              className="flex items-center gap-2"
                            >
                              {inspector.avatar && (
                                <img
                                  src={inspector.avatar || "/placeholder.svg"}
                                  alt={inspector.name}
                                  className="h-6 w-6 rounded-full"
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium">
                                  {inspector.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {inspector.role}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        {establishment.assignedInspectors.length === 0 && (
                          <span className="text-sm text-muted-foreground">
                            No inspectors assigned
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(establishment.inspectionStatus)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(establishment.priority)}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`text-sm ${
                          new Date(establishment.dueDate) < new Date() &&
                          establishment.inspectionStatus !== "completed"
                            ? "text-red-600 font-medium"
                            : ""
                        }`}
                      >
                        {new Date(establishment.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {establishment.complianceScore ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={`text-sm font-medium ${
                              establishment.complianceScore >= 80
                                ? "text-green-600"
                                : establishment.complianceScore >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {establishment.complianceScore}%
                          </div>
                          {establishment.violations > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {establishment.violations} violations
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEstablishment(establishment);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEstablishment(establishment);
                              setIsReassignDialogOpen(true);
                            }}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Reassign Inspectors
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEstablishment(establishment);
                              setIsAttachmentDialogOpen(true);
                            }}
                          >
                            <Paperclip className="h-4 w-4 mr-2" />
                            Manage Attachments
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Assignment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Establishment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Establishment Details</DialogTitle>
            <DialogDescription>
              Update establishment information and inspection settings.
            </DialogDescription>
          </DialogHeader>
          {selectedEstablishment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Establishment Name</Label>
                  <Input
                    id="name"
                    defaultValue={selectedEstablishment.establishment.name}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    defaultValue={selectedEstablishment.establishment.category}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="Mining">Mining</SelectItem>
                      <SelectItem value="Textile">Textile</SelectItem>
                      <SelectItem value="Chemical">Chemical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  defaultValue={selectedEstablishment.establishment.address}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Inspection Status</Label>
                  <Select defaultValue={selectedEstablishment.inspectionStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue={selectedEstablishment.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  defaultValue={selectedEstablishment.notes}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsEditDialogOpen(false);
                toast.success("Establishment details updated successfully");
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Inspectors Dialog */}
      <Dialog
        open={isReassignDialogOpen}
        onOpenChange={setIsReassignDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reassign Inspectors</DialogTitle>
            <DialogDescription>
              Select inspectors to assign to this establishment.
            </DialogDescription>
          </DialogHeader>
          {selectedEstablishment && (
            <div className="space-y-4">
              <div className="text-sm font-medium">
                Current Assignment: {selectedEstablishment.establishment.name}
              </div>

              <div className="space-y-2">
                <Label>Available Inspectors</Label>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {inspectors.map((inspector) => (
                    <div
                      key={inspector.id}
                      className="flex items-center space-x-2 p-2 border rounded"
                    >
                      <Checkbox
                        id={`inspector-${inspector.id}`}
                        defaultChecked={selectedEstablishment.assignedInspectors.some(
                          (ai) => ai.id === inspector.id
                        )}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {inspector.avatar && (
                            <img
                              src={inspector.avatar || "/placeholder.svg"}
                              alt={inspector.name}
                              className="h-8 w-8 rounded-full"
                            />
                          )}
                          <div>
                            <div className="font-medium">{inspector.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {inspector.role} • {inspector.department}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Workload: {inspector.workload}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReassignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedEstablishment) {
                  handleReassignInspectors(selectedEstablishment.id, [1, 2]); // Mock selection
                }
              }}
            >
              Reassign Inspectors
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attachment Management Dialog */}
      <Dialog
        open={isAttachmentDialogOpen}
        onOpenChange={setIsAttachmentDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Attachments</DialogTitle>
            <DialogDescription>
              View and manage files attached to this establishment.
            </DialogDescription>
          </DialogHeader>
          {selectedEstablishment && (
            <div className="space-y-4">
              <div className="text-sm font-medium">
                Establishment: {selectedEstablishment.establishment.name}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    Attachments ({selectedEstablishment.attachments.length})
                  </Label>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add File
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedEstablishment.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{attachment.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(attachment.size / 1024 / 1024).toFixed(2)} MB •
                            Uploaded by {attachment.uploadedBy} on{" "}
                            {new Date(
                              attachment.uploadedAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {selectedEstablishment.attachments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No attachments found
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAttachmentDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
