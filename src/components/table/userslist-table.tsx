import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getUsers } from "@/endpoints/api";
import { useAuth } from "@/contexts/useAuth";
import type { User } from "@/types";
import { LoadingWave } from "@/components/ui/loading-wave";
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
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AddUserForm } from "@/components/form/add_user-form";
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
  const [statusFilter, setStatusFilter] = useState<string[]>(['active', 'inactive']);
  const [userLevelFilter, setUserLevelFilter] = useState<string[]>(['admin', 'manager', 'inspector']);

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
      .includes(searchTerm.toLowerCase()) &&
    statusFilter.includes(user.status) &&
    userLevelFilter.includes(user.user_level)
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

  const handleUserAdded = () => {
    fetchUsers();
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleUserLevelFilter = (level: string) => {
    setUserLevelFilter(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const UserActionsDropdown = ({ userId }: { userId: number }) => {
  const user = users.find(u => u.id === userId);
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
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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

  if (loading) {
    return <LoadingWave message="Loading..." />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">User Management</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all registered users and their permissions
            </p>
          </div>
          <Button asChild className="flex items-center gap-2">
          <AddUserForm onUserAdded={handleUserAdded} />
          </Button>
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('active')}
                onCheckedChange={() => toggleStatusFilter('active')}
              >
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('inactive')}
                onCheckedChange={() => toggleStatusFilter('inactive')}
              >
                Inactive
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>User Level</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={userLevelFilter.includes('admin')}
                onCheckedChange={() => toggleUserLevelFilter('admin')}
              >
                Admin
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={userLevelFilter.includes('manager')}
                onCheckedChange={() => toggleUserLevelFilter('manager')}
              >
                Manager
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={userLevelFilter.includes('inspector')}
                onCheckedChange={() => toggleUserLevelFilter('inspector')}
              >
                Inspector
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
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
                <TableHead className="w-[140px] text-left">ID Number</TableHead>
                <TableHead className="w-[155px] text-left">Name</TableHead>
                <TableHead className="w-[325px] text-left">Email</TableHead>
                <TableHead className="w-[100px] text-center">User Level</TableHead>
                <TableHead className="w-[230px] text-center">Status</TableHead>
                <TableHead className="w-[140px] text-left">Created At</TableHead>
                <TableHead className="w-[140px] text-left">Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <ScrollArea className="h-[calc(100vh-326px)] flex-1 w-full">
            <Table>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="w-[40px]">
                        <Checkbox 
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={() => handleUserSelect(user.id)}
                          aria-label={`Select ${user.first_name} ${user.last_name}`}
                        />
                      </TableCell>
                      <TableCell className="w-[140px] text-left font-bold">{user.id_number}</TableCell>
                      <TableCell className="w-[155px] text-left font-medium">{user.first_name} {user.last_name}</TableCell>
                      <TableCell className="w-[325px] text-left font-medium">{user.email}</TableCell>
                      <TableCell className="w-[100px] text-center">
                        <Badge 
                          variant={
                            user.user_level === 'admin' ? 'default' : 
                            user.user_level === 'manager' ? 'secondary' : 'outline'
                          }
                          className={cn("capitalize", {
                            'w-20 bg-red-600 hover:bg-red-700 text-white': user.user_level === 'admin',
                            'w-20 bg-blue-600 hover:bg-blue-700 text-white': user.user_level === 'manager',
                            'w-20 bg-green-600 hover:bg-green-700 text-white': user.user_level === 'inspector',
                          })}
                        >
                          {user.user_level}
                        </Badge>     
                      </TableCell>
                      <TableCell className="w-[230px] text-center font-medium">
                        <Badge
                          variant={user.status === 'active' ? 'default' : 'destructive'}
                          className={cn("capitalize", {
                            'w-15 bg-emerald-600 hover:bg-emerald-700 rounded-full': user.status === 'active',
                            'w-15 bg-rose-600 hover:bg-rose-700 rounded-full': user.status === 'inactive',
                            'animate-pulse': user.status === 'active',
                          })}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[140px] text-left font-medium">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="w-[140px] text-left font-medium">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </TableCell>                      
                      <TableCell className="text-right">
                        <UserActionsDropdown userId={user.id} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      {searchTerm ? "No matching users found" : "No users available"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersListTable;