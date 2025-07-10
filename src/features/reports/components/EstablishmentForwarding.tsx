"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Building,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/useAuth";
import { forwardingApi } from "@/lib/reportApi";
import type { EstablishmentForwardingType } from "@/types/reports";

interface EstablishmentForwardingProps {
  showForwardButton?: boolean;
}

export default function EstablishmentForwardingComponent({
  showForwardButton = true,
}: EstablishmentForwardingProps) {
  const { user } = useAuth();
  const [forwardings, setForwardings] = useState<EstablishmentForwardingType[]>(
    []
  );
  const [availablePersonnel, setAvailablePersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showForwardDialog, setShowForwardDialog] = useState(false);

  const [forwardingForm, setForwardingForm] = useState({
    establishment_id: "",
    forwarded_to: "",
    forwarding_reason: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    due_date: "",
    notes: "",
  });

  useEffect(() => {
    loadForwardings();
    loadAvailablePersonnel();
  }, [statusFilter, searchTerm]);

  const loadForwardings = async () => {
    try {
      setLoading(true);

      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== "all") params.status = statusFilter;

      // Filter based on user role
      if (user?.user_level !== "division_chief") {
        params.forwarded_to = user?.id;
      }

      const response = await forwardingApi.getForwardedEstablishments(params);
      setForwardings(response.results);
    } catch (error) {
      console.error("Error loading forwardings:", error);
      toast.error("Failed to load establishment forwardings");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailablePersonnel = async () => {
    try {
      const personnel = await forwardingApi.getAvailablePersonnel();
      setAvailablePersonnel(personnel);
    } catch (error) {
      console.error("Error loading personnel:", error);
    }
  };

  const handleForwardEstablishment = async () => {
    try {
      await forwardingApi.forwardEstablishment({
        establishment_id: Number.parseInt(forwardingForm.establishment_id),
        forwarded_to: Number.parseInt(forwardingForm.forwarded_to),
        forwarding_reason: forwardingForm.forwarding_reason,
        priority: forwardingForm.priority,
        due_date: forwardingForm.due_date || undefined,
        notes: forwardingForm.notes || undefined,
      });

      toast.success("Establishment forwarded successfully");
      setShowForwardDialog(false);
      setForwardingForm({
        establishment_id: "",
        forwarded_to: "",
        forwarding_reason: "",
        priority: "medium",
        due_date: "",
        notes: "",
      });
      loadForwardings();
    } catch (error) {
      console.error("Error forwarding establishment:", error);
      toast.error("Failed to forward establishment");
    }
  };

  const handleAcceptForwarding = async (forwardingId: number) => {
    try {
      await forwardingApi.acceptForwarding(forwardingId);
      toast.success("Forwarding accepted");
      loadForwardings();
    } catch (error) {
      console.error("Error accepting forwarding:", error);
      toast.error("Failed to accept forwarding");
    }
  };

  const handleCompleteForwarding = async (forwardingId: number) => {
    try {
      await forwardingApi.completeForwarding(forwardingId);
      toast.success("Forwarding completed");
      loadForwardings();
    } catch (error) {
      console.error("Error completing forwarding:", error);
      toast.error("Failed to complete forwarding");
    }
  };

  const handleRejectForwarding = async (forwardingId: number) => {
    try {
      await forwardingApi.rejectForwarding(
        forwardingId,
        "Rejected by assignee"
      );
      toast.success("Forwarding rejected");
      loadForwardings();
    } catch (error) {
      console.error("Error rejecting forwarding:", error);
      toast.error("Failed to reject forwarding");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      accepted: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        className={
          priorityConfig[priority as keyof typeof priorityConfig] ||
          priorityConfig.medium
        }
      >
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const canAccept = (forwarding: EstablishmentForwardingType) => {
    return (
      forwarding.forwarded_to.id === user?.id && forwarding.status === "pending"
    );
  };

  const canComplete = (forwarding: EstablishmentForwardingType) => {
    return (
      forwarding.forwarded_to.id === user?.id &&
      forwarding.status === "accepted"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Establishment Forwarding
          </h1>
          <p className="text-muted-foreground">
            Manage establishment assignments and forwarding workflow
          </p>
        </div>
        {showForwardButton && (
          <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Forward Establishment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Forward Establishment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Establishment ID
                    </label>
                    <Input
                      value={forwardingForm.establishment_id}
                      onChange={(e) =>
                        setForwardingForm({
                          ...forwardingForm,
                          establishment_id: e.target.value,
                        })
                      }
                      placeholder="Enter establishment ID"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Forward To
                    </label>
                    <Select
                      value={forwardingForm.forwarded_to}
                      onValueChange={(value) =>
                        setForwardingForm({
                          ...forwardingForm,
                          forwarded_to: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select personnel" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePersonnel.map((person) => (
                          <SelectItem
                            key={person.id}
                            value={person.id.toString()}
                          >
                            {person.first_name} {person.last_name} -{" "}
                            {person.user_level.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Priority
                    </label>
                    <Select
                      value={forwardingForm.priority}
                      onValueChange={(value) =>
                        setForwardingForm({
                          ...forwardingForm,
                          priority: value as any,
                        })
                      }
                    >
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={forwardingForm.due_date}
                      onChange={(e) =>
                        setForwardingForm({
                          ...forwardingForm,
                          due_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Forwarding Reason
                  </label>
                  <Textarea
                    value={forwardingForm.forwarding_reason}
                    onChange={(e) =>
                      setForwardingForm({
                        ...forwardingForm,
                        forwarding_reason: e.target.value,
                      })
                    }
                    placeholder="Explain why this establishment is being forwarded..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Additional Notes
                  </label>
                  <Textarea
                    value={forwardingForm.notes}
                    onChange={(e) =>
                      setForwardingForm({
                        ...forwardingForm,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Any additional information or instructions..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowForwardDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleForwardEstablishment}
                    disabled={
                      !forwardingForm.establishment_id ||
                      !forwardingForm.forwarded_to ||
                      !forwardingForm.forwarding_reason
                    }
                  >
                    Forward Establishment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Forwardings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search establishments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={loadForwardings}>
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forwardings Table */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Establishment</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Forwarded</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forwardings.map((forwarding) => (
                  <TableRow key={forwarding.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{forwarding.establishment.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {forwarding.establishment.address}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {forwarding.forwarded_from.first_name}{" "}
                        {forwarding.forwarded_from.last_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {forwarding.forwarded_to.first_name}{" "}
                        {forwarding.forwarded_to.last_name}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(forwarding.status)}</TableCell>
                    <TableCell>
                      {getPriorityBadge(forwarding.priority)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(forwarding.forwarded_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {forwarding.due_date ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(forwarding.due_date).toLocaleDateString()}
                        </div>
                      ) : (
                        "-"
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
                          {canAccept(forwarding) && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleAcceptForwarding(forwarding.id)
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Accept
                            </DropdownMenuItem>
                          )}
                          {canComplete(forwarding) && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleCompleteForwarding(forwarding.id)
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete
                            </DropdownMenuItem>
                          )}
                          {canAccept(forwarding) && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleRejectForwarding(forwarding.id)
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {forwardings.length === 0 && !loading && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No forwardings found
              </h3>
              <p className="text-muted-foreground">
                No establishment forwardings match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
