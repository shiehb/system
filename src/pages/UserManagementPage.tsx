import { useEffect, useState } from "react";
import { getUsers } from "../endpoints/api";
import { useAuth } from "../contexts/useAuth";
import type { User } from "@/types";
import { LoadingWave } from "@/components/ui/loading-wave";

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import {Table,TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShieldAlert,
  MoreHorizontal,
  Filter,
  CheckCircle,
  Edit2,
  Ban,
  ShieldCheck
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { AddUserForm } from "@/components/form/add_user-form";

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const { isAuthenticated } = useAuth();
  // const navigate = useNavigate();

  

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
      setError("You don't have permission to view users. Admin access required.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name} ${user.email} ${user.id_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (userId: number) => {
    setSelectedUserIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(user => user.id));
    }
  };

  // ADDED: Refresh users after adding a new one
  const handleUserAdded = () => {
    fetchUsers();
  };

  const UserActionsDropdown = ({ userId }: { userId: number }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 focus-visible:ring-offset-2"
            aria-label="User actions"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-white dark:bg-gray-800"
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
              className="cursor-pointer">
                <Edit2 className="mr-2 h-4 w-4" />
                <span>Edit</span>
            </DropdownMenuItem>
          <DropdownMenuItem 
              className="cursor-pointer">
                {users.find(user => user.id === userId)?.status === "active" ? (
                    <>
                      <Ban className="mr-2 h-4 w-4 text-destructive" />
                     <span className="text-destructive">Deactivate</span>
                   </>
                ) : (
                    <>
                     <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                     <span className="text-green-500">Activate</span>
                  </>
                )}
            </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Reset Password</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (loading) {
    return (
      <LoadingWave message="Loading..." />
    );
  }

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <Card >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold">User Management</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage all registered users and their permissions
                      </p>
                    </div>
                    {/* REPLACED the Button with AddUserForm */}
                    <AddUserForm onUserAdded={handleUserAdded} />
                  </div>
                </CardHeader>
                
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle>Access Denied</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by name, email or ID..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="w-[40px]">
                            <Checkbox 
                              checked={
                                filteredUsers.length > 0 && 
                                selectedUserIds.length === filteredUsers.length
                              }
                              onCheckedChange={handleSelectAll}
                              aria-label="Select all users"
                            />
                          </TableHead>
                          <TableHead className="w-[120px]">ID Number</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/50">
                              <TableCell>
                                <Checkbox 
                                  checked={selectedUserIds.includes(user.id)}
                                  onCheckedChange={() => handleUserSelect(user.id)}
                                  aria-label={`Select ${user.first_name} ${user.last_name}`}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{user.id_number}</TableCell>
                              <TableCell>
                                {user.first_name} {user.last_name}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={user.user_level === 'admin' ? 'default' : 'outline'} 
                                  className="capitalize"
                                >
                                  {user.user_level}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={user.status === 'active' ? 'default' : 'destructive'} 
                                  className="capitalize"
                                >
                                  {user.status}
                                </Badge>
                              </TableCell>                      
                              <TableCell className="text-right">
                                <UserActionsDropdown userId={user.id} />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              {searchTerm ? "No matching users found" : "No users available"}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default UserManagementPage;