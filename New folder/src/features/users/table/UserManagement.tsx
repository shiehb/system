"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/useAuth";
import type { User, UserLevel } from "@/types";
import { ResetPassword } from "@/features/users/form/reset-password-form";
import { useUsers } from "@/hooks/useUsers"; // Import the new hook
import { useQueryClient } from "@tanstack/react-query"; // Import useQueryClient

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  ShieldAlert,
  MoreHorizontal,
  Filter,
  Edit2,
  X,
  Check,
  Users,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Mail,
  Shield,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { EditUserForm } from "@/features/users/form/edit-user-form";
import { ChangeStatus } from "@/features/users/form/change-status-form";
import { toast } from "sonner";

const USER_LEVELS: UserLevel[] = [
  "division_chief",
  "eia_air_water_section_chief",
  "toxic_hazardous_section_chief",
  "solid_waste_section_chief",
  "eia_monitoring_unit_head",
  "air_quality_unit_head",
  "water_quality_unit_head",
  "eia_monitoring_personnel",
  "air_quality_monitoring_personnel",
  "water_quality_monitoring_personnel",
  "toxic_chemicals_monitoring_personnel",
  "solid_waste_monitoring_personnel",
];

interface UsersListTableProps {
  onSelectionChange?: (ids: number[]) => void;
  onUsersData?: (users: User[]) => void;
}

const UsersListTable = ({
  onSelectionChange,
  onUsersData,
}: UsersListTableProps) => {
  const queryClient = useQueryClient(); // Initialize query client
  const { isAuthenticated } = useAuth();
  const {
    data: users,
    isLoading: loading,
    isFetching: refreshing,
    error,
    refetch,
  } = useUsers(); // Use the useUsers hook

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "active",
    "inactive",
  ]);
  const [userLevelFilter, setUserLevelFilter] =
    useState<UserLevel[]>(USER_LEVELS);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedUserIds);
    }
  }, [selectedUserIds, onSelectionChange]);

  useEffect(() => {
    if (onUsersData && users) {
      onUsersData(users);
    }
  }, [users, onUsersData]);

  // Debounced search effect
  useEffect(() => {
    if (searchTerm) {
      setSearchLoading(true);
      const timer = setTimeout(() => {
        setSearchLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchLoading(false);
    }
  }, [searchTerm]);

  const handleRefresh = () => {
    refetch(); // Use refetch from useQuery
  };

  const filteredUsers = (users || []).filter(
    (user) =>
      `${user.first_name} ${user.last_name} ${user.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      statusFilter.includes(user.status) &&
      userLevelFilter.includes(user.user_level)
  );

  const handleUserSelect = (userId: number) => {
    const newSelectedIds = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((id) => id !== userId)
      : [...selectedUserIds, userId];
    setSelectedUserIds(newSelectedIds);
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((user) => user.id));
    }
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleUserLevelFilter = (level: UserLevel) => {
    setUserLevelFilter((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const UserActionsDropdown = ({ userId }: { userId: number }) => {
    const user = users?.find((u) => u.id === userId);
    const [editOpen, setEditOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    if (!user) return null;

    const handleStatusChanged = async () => {
      setActionLoading(true);
      try {
        // Invalidate and refetch users after status change
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("User status updated successfully.");
      } catch (error) {
        toast.error("Failed to update user status.");
        console.error("Error updating user status:", error);
      } finally {
        setActionLoading(false);
      }
    };

    const handleUserUpdated = async () => {
      setActionLoading(true);
      try {
        // Invalidate and refetch users after user update
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("User profile updated successfully.");
      } catch (error) {
        toast.error("Failed to update user profile.");
        console.error("Error updating user profile:", error);
      } finally {
        setActionLoading(false);
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 focus-visible:ring-offset-2 cursor-pointer hover:bg-muted/80 transition-colors"
            aria-label="User actions"
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-auto bg-background border shadow-lg"
        >
          <DropdownMenuLabel className="font-semibold">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onSelect={(e) => {
              e.preventDefault();
              setEditOpen(true);
            }}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            <span>Edit User</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onSelect={(e) => e.preventDefault()}
          >
            <ChangeStatus
              userId={user.id}
              currentStatus={user.status}
              userName={`${user.first_name} ${user.last_name}`}
              onStatusChanged={handleStatusChanged}
            />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <ResetPassword
              email={user.email}
              userName={`${user.first_name} ${user.last_name}`}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>

        <EditUserForm
          user={user}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUserUpdated={handleUserUpdated}
        />
      </DropdownMenu>
    );
  };

  const getUserLevelBadgeVariant = (userLevel: UserLevel) => {
    if (userLevel.includes("chief")) return "default";
    if (userLevel.includes("head")) return "secondary";
    return "outline";
  };

  const formatUserLevel = (userLevel: UserLevel) => {
    return userLevel
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg"
        >
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {searchTerm ? "No matching users found" : "No users available"}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {searchTerm
          ? "Try adjusting your search criteria or filters to find the users you're looking for"
          : "Users will appear here once they are added to the system"}
      </p>
      {searchTerm && (
        <Button
          variant="outline"
          onClick={() => setSearchTerm("")}
          className="mt-2"
        >
          Clear Search
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                User Directory
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage and monitor user accounts
              </p>
            </div>
            {refreshing && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Refreshing...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10 w-full md:w-80 lg:w-96 bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchLoading && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="cursor-pointer sm:w-auto md:w-32 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white/70 dark:bg-slate-800/70"
                    variant="outline"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {(statusFilter.length < 2 ||
                      userLevelFilter.length < USER_LEVELS.length) && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 w-5 p-0 text-xs bg-blue-100 text-blue-600"
                      >
                        !
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-0 shadow-xl"
                >
                  <DropdownMenuLabel className="font-semibold">
                    Filter by Status
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("active")}
                    onCheckedChange={() => toggleStatusFilter("active")}
                    className="cursor-pointer"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Active Users
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("inactive")}
                    onCheckedChange={() => toggleStatusFilter("inactive")}
                    className="cursor-pointer"
                  >
                    <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                    Inactive Users
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="font-semibold">
                    Filter by User Level
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-48">
                    {USER_LEVELS.map((level) => (
                      <DropdownMenuCheckboxItem
                        key={level}
                        checked={userLevelFilter.includes(level)}
                        onCheckedChange={() => toggleUserLevelFilter(level)}
                        className="cursor-pointer"
                      >
                        {formatUserLevel(level)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700"
              >
                <RefreshCw
                  className={cn("h-4 w-4", refreshing && "animate-spin")}
                />
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="mt-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          >
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-hidden w-full">
          {/* Desktop Table */}
          <div className="hidden sm:block">
            <div className="bg-white dark:bg-slate-900">
              <ScrollArea className="h-[calc(100vh-400px)] md:h-[calc(100vh-380px)] xl:h-[calc(100vh-360px)]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur">
                    <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
                      <TableHead className="w-12 text-center">
                        <Checkbox
                          checked={
                            filteredUsers.length > 0 &&
                            selectedUserIds.length === filteredUsers.length
                          }
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all users"
                          className="cursor-pointer"
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        User
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Contact
                      </TableHead>
                      <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">
                        Role
                      </TableHead>
                      <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">
                        Status
                      </TableHead>
                      <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">
                        Joined
                      </TableHead>
                      <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TableCell className="text-center">
                            <Checkbox
                              checked={selectedUserIds.includes(user.id)}
                              onCheckedChange={() => handleUserSelect(user.id)}
                              aria-label={`Select ${user.first_name} ${user.last_name}`}
                              className="cursor-pointer"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-700">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name} ${user.last_name}`}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                                  {getInitials(user.first_name, user.last_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                  {user.first_name} {user.last_name}
                                </div>
                                {user.middle_name && (
                                  <div className="text-xs text-muted-foreground">
                                    {user.middle_name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant={getUserLevelBadgeVariant(
                                      user.user_level
                                    )}
                                    className="cursor-help transition-colors hover:bg-primary/20 flex items-center gap-1"
                                  >
                                    <Shield className="h-3 w-3" />
                                    {formatUserLevel(user.user_level)}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="max-w-[200px] text-center"
                                >
                                  <p className="font-medium">
                                    {formatUserLevel(user.user_level)}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {user.user_level.replace(/_/g, " ")}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                              className={cn(
                                "relative capitalize text-center gap-1.5 py-1 px-3 rounded-full transition-all",
                                {
                                  "bg-green-100 text-green-800 hover:bg-green-200 border-green-300 dark:bg-green-900/30 dark:text-green-400":
                                    user.status === "active",
                                  "bg-red-100 text-red-800 hover:bg-red-200 border-red-300 dark:bg-red-900/30 dark:text-red-400":
                                    user.status === "inactive",
                                }
                              )}
                            >
                              {user.status === "active" ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(user.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <UserActionsDropdown userId={user.id} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32">
                          <EmptyState />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <ScrollArea className="h-[calc(100vh-400px)] p-4">
              <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <Card
                      key={user.id}
                      className="p-4 shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3 flex-1">
                          <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-slate-700">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name} ${user.last_name}`}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                              {getInitials(user.first_name, user.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                              {user.first_name} {user.last_name}
                            </h4>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                              <Mail className="h-3 w-3" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedUserIds.includes(user.id)}
                            onCheckedChange={() => handleUserSelect(user.id)}
                            aria-label={`Select ${user.first_name} ${user.last_name}`}
                            className="cursor-pointer"
                          />
                          <UserActionsDropdown userId={user.id} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Role:
                          </span>
                          <Badge
                            variant={getUserLevelBadgeVariant(user.user_level)}
                            className="mt-1 text-xs"
                          >
                            {formatUserLevel(user.user_level)}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">
                            Status:
                          </span>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className={cn("mt-1 text-xs capitalize", {
                              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400":
                                user.status === "active",
                              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400":
                                user.status === "inactive",
                            })}
                          >
                            {user.status === "active" ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            {user.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Joined{" "}
                              {new Date(user.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>ID: {user.id}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersListTable;
