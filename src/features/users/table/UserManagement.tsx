import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getUsers } from "@/lib/api";
import { useAuth } from "@/contexts/useAuth";
import type { User, UserLevel } from "@/types";
import { ResetPassword } from "@/features/users/form/reset-password-form";

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
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import { EditUserForm } from "@/features/users/form/edit-user-form";
import { ChangeStatus } from "@/features/users/form/change-status-form";

const USER_LEVELS: UserLevel[] = [
  "administrator",
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const { isAuthenticated } = useAuth();

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "active",
    "inactive",
  ]);
  const [userLevelFilter, setUserLevelFilter] =
    useState<UserLevel[]>(USER_LEVELS);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedUserIds);
    }
  }, [selectedUserIds]);

  useEffect(() => {
    if (onUsersData) {
      onUsersData(users);
    }
  }, [users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      setError(
        "You don't have permission to view users. Admin access required."
      );
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
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
    const user = users.find((u) => u.id === userId);
    const [editOpen, setEditOpen] = useState(false);

    if (!user) return null;

    const handleStatusChanged = () => {
      fetchUsers();
    };

    const handleUserUpdated = () => {
      fetchUsers();
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-6 w-8 p-0 focus-visible:ring-offset-2 cursor-pointer"
            aria-label="User actions"
          >
            <MoreHorizontal className="" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 bg-white dark:bg-gray-800"
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              setEditOpen(true);
            }}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
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
            className="cursor-pointer"
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
    if (userLevel.includes("administrator")) return "default";
    if (userLevel.includes("chief")) return "secondary";
    if (userLevel.includes("head")) return "outline";
    return "outline";
  };

  const formatUserLevel = (userLevel: UserLevel) => {
    return userLevel
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Card className="sm:h-auto md:h-[calc(100vh-110px)] w-full rounded-none border-0">
      <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
        <CardTitle>User Management</CardTitle>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto ">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-8 w-full md:w-85 lg:w-100 bg-background border-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="cursor-pointer sm:w-auto md:w-35 border-foreground"
                variant="outline"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-35 bg-white dark:bg-gray-800"
            >
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("active")}
                onCheckedChange={() => toggleStatusFilter("active")}
              >
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("inactive")}
                onCheckedChange={() => toggleStatusFilter("inactive")}
              >
                Inactive
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>User Level</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {USER_LEVELS.map((level) => (
                <DropdownMenuCheckboxItem
                  key={level}
                  checked={userLevelFilter.includes(level)}
                  onCheckedChange={() => toggleUserLevelFilter(level)}
                >
                  {formatUserLevel(level)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden w-full">
          {/* Desktop Table */}
          <div className="hidden sm:block">
            <Table className="bg-background border-1 rounded-none">
              <ScrollArea className="h-[calc(100vh-310px)] md:h-[calc(100vh-275px)] xl:h-[calc(100vh-260px)]">
                <TableHeader className="sticky bg-muted top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[10px] min-w-[10px] text-center p-2">
                      <Checkbox
                        checked={
                          users.length > 0 &&
                          selectedUserIds.length === users.length
                        }
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all users"
                        className="cursor-pointer mx-auto"
                      />
                    </TableHead>

                    <TableHead className="w-[200px] text-left">Name</TableHead>

                    <TableHead className="w-[200px] text-left">Email</TableHead>

                    <TableHead className="w-[150px] min-w-[150px] text-center">
                      User Level
                    </TableHead>

                    <TableHead className="w-[120px] min-w-[120px] text-center">
                      Created At
                    </TableHead>

                    <TableHead className="w-[120px] min-w-[120px] text-center">
                      Updated At
                    </TableHead>

                    <TableHead className="w-[100px] min-w-[100px] text-center">
                      Status
                    </TableHead>

                    <TableHead className="w-8 min-w-8 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted">
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedUserIds.includes(user.id)}
                            onCheckedChange={() => handleUserSelect(user.id)}
                            aria-label={`Select ${user.first_name} ${user.last_name}`}
                            className="cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="text-left">
                          <span className="font-medium">{user.last_name}</span>
                          {", "}
                          {user.first_name} {user.middle_name}
                        </TableCell>
                        <TableCell className="text-left">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant={getUserLevelBadgeVariant(
                                    user.user_level
                                  )}
                                  className="capitalize"
                                >
                                  {formatUserLevel(user.user_level)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                align="start"
                                className="max-w-[180px]"
                                sideOffset={5}
                              >
                                {user.user_level.replace(/_/g, " ")}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {new Date(user.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className={cn(
                              "relative capitalize text-center text-foreground border-foreground gap-1.5 py-1 w-20 select-none rounded-none",
                              {
                                "bg-green-50 hover:bg-green-400/30":
                                  user.status === "active",
                                "bg-rose-50 hover:bg-rose-600/30":
                                  user.status === "inactive",
                              }
                            )}
                          >
                            {user.status === "active" && (
                              <>
                                <Check className="h-3.5 w-3.5" />
                              </>
                            )}
                            {user.status === "inactive" && (
                              <X className="h-3.5 w-3.5" />
                            )}
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <UserActionsDropdown userId={user.id} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        {searchTerm
                          ? "No matching users found"
                          : "No users available"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </ScrollArea>
            </Table>
          </div>

          {/* Mobile Card View */}
          <ScrollArea className="h-[calc(100vh-340px)] sm:hidden pr-2 border border-foreground">
            <div className="block p-2 space-y-4">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-md p-4 shadow-sm bg-white dark:bg-muted"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold">
                        {user.first_name} {user.last_name}
                      </div>
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => handleUserSelect(user.id)}
                        aria-label={`Select ${user.first_name} ${user.last_name}`}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">Email: {user.email}</div>
                      <div className="text-sm">
                        User Level: {formatUserLevel(user.user_level)}
                      </div>
                      <div className="text-sm capitalize">
                        Status: {user.status}
                      </div>
                      <div className="text-sm">
                        Created:{" "}
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm">
                        Updated:{" "}
                        {new Date(user.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <UserActionsDropdown userId={user.id} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  {searchTerm
                    ? "No matching users found"
                    : "No users available"}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersListTable;
