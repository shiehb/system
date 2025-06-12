import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getUsers } from "@/endpoints/api";
import { useAuth } from "@/contexts/useAuth";
import type { User } from "@/types";
import { ResetPassword } from "@/components/form/reset-password-form";

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

import { EditUserForm } from "@/components/form/edit-user-form";
import { ChangeStatus } from "@/components/form/change-status-form";

const UsersListTable = () => {
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
  const [userLevelFilter, setUserLevelFilter] = useState<string[]>([
    "admin",
    "manager",
    "inspector",
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

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
      `${user.first_name} ${user.last_name} ${user.email} ${user.id_number}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      statusFilter.includes(user.status) &&
      userLevelFilter.includes(user.user_level)
  );

  const handleUserSelect = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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

  const toggleUserLevelFilter = (level: string) => {
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
          className="w-40 bg-white dark:bg-gray-800 "
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Edit User */}
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

          {/* Change Status */}
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

          {/* Reset Password */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="cursor-pointer"
          >
            <ResetPassword
              idNumber={user.id_number}
              userName={`${user.first_name} ${user.last_name}`}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>

        {/* Edit User Dialog */}
        <EditUserForm
          user={user}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUserUpdated={handleUserUpdated}
        />
      </DropdownMenu>
    );
  };

  return (
    <Card className="h-[calc(100vh-150px)] w-full">
      <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
        <CardTitle>User Management</CardTitle>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email or ID..."
              className="pl-8 w-full md:w-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer w-35" variant="outline">
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
              <DropdownMenuCheckboxItem
                checked={userLevelFilter.includes("admin")}
                onCheckedChange={() => toggleUserLevelFilter("admin")}
              >
                Admin
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={userLevelFilter.includes("manager")}
                onCheckedChange={() => toggleUserLevelFilter("manager")}
              >
                Manager
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={userLevelFilter.includes("inspector")}
                onCheckedChange={() => toggleUserLevelFilter("inspector")}
              >
                Inspector
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-hidden w-full ">
          {/* Desktop Table */}
          <div className="hidden sm:block min-w-[900px] ">
            <Table>
              <ScrollArea className="h-[calc(100vh-260px)]  w-full ">
                <TableHeader className="bg-green-200 sticky top-0 z-10 ">
                  <TableRow>
                    <TableHead className="w-[40px] min-w-[40px] max-w-[40px] border-b text-center">
                      <Checkbox
                        checked={
                          filteredUsers.length > 0 &&
                          selectedUserIds.length === filteredUsers.length
                        }
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all users"
                        className="cursor-pointer bg-white"
                      />
                    </TableHead>
                    <TableHead className="w-[90px] min-w-[90px] max-w-[90px] border-b text-left">
                      ID Number
                    </TableHead>
                    <TableHead className="w-[200px] min-w-[200px] max-w-[200px] border text-left">
                      Name
                    </TableHead>
                    <TableHead className="w-[200px] min-w-[200px] max-w-[200px] border text-left">
                      Email
                    </TableHead>
                    <TableHead className="w-[100px] min-w-[100px] max-w-[100px] border text-center">
                      User Level
                    </TableHead>
                    <TableHead className="w-[120px] min-w-[120px] max-w-[120px] border text-center">
                      Created At
                    </TableHead>
                    <TableHead className="w-[120px] min-w-[120px] max-w-[120px] border text-center">
                      Updated At
                    </TableHead>
                    <TableHead className="w-[100px] min-w-[100px] max-w-[100px] border text-center">
                      Status
                    </TableHead>
                    <TableHead className="w-[30px] min-w-[30px] max-w-[30px] border text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className=" hover:bg-muted/50">
                        <TableCell className=" border-b text-center">
                          <Checkbox
                            checked={selectedUserIds.includes(user.id)}
                            onCheckedChange={() => handleUserSelect(user.id)}
                            aria-label={`Select ${user.first_name} ${user.last_name}`}
                            className="cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className=" border-b text-left font-bold">
                          {user.id_number}
                        </TableCell>
                        <TableCell className=" border text-left font-medium">
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell className=" border text-left font-medium">
                          {user.email}
                        </TableCell>
                        <TableCell className=" border text-center">
                          <Badge
                            variant={
                              user.user_level === "admin"
                                ? "default"
                                : user.user_level === "manager"
                                ? "secondary"
                                : "outline"
                            }
                            className={cn(
                              "capitalize py-1 w-20 bg-transparent border-1 select-none",
                              {
                                " border-red-600 hover:bg-red-50 text-red-700":
                                  user.user_level === "admin",
                                " border-blue-600 hover:bg-blue-50 text-blue-700":
                                  user.user_level === "manager",
                                " border-green-600 hover:bg-green-50 text-green-700":
                                  user.user_level === "inspector",
                              }
                            )}
                          >
                            {user.user_level}
                          </Badge>
                        </TableCell>

                        <TableCell className=" border text-center font-medium">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className=" border text-center font-medium">
                          {new Date(user.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className=" border text-center">
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className={cn(
                              "relative capitalize text-center gap-1.5 py-1 w-20 select-none",
                              {
                                "bg-green-400/10 text-green-700 border-green-600 hover:bg-green-400/30":
                                  user.status === "active",
                                "bg-rose-600/10 text-rose-800 border-rose-600 hover:bg-rose-600/30":
                                  user.status === "inactive",
                              }
                            )}
                          >
                            {user.status === "active" && (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-20" />
                              </>
                            )}
                            {user.status === "inactive" && (
                              <X className="h-3.5 w-3.5" />
                            )}
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className=" border text-center">
                          <UserActionsDropdown userId={user.id} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
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
          <div className="block sm:hidden p-2 space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
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
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  <div className="text-sm">ID: {user.id_number}</div>
                  <div className="text-sm capitalize">
                    Level: {user.user_level}
                  </div>
                  <div className="text-sm capitalize">
                    Status: {user.status}
                  </div>
                  <div className="text-sm">
                    Created: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    Updated: {new Date(user.updated_at).toLocaleDateString()}
                  </div>
                  <div className="mt-2 text-right">
                    <UserActionsDropdown userId={user.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                {searchTerm ? "No matching users found" : "No users available"}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersListTable;
