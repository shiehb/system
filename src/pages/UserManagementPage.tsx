"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Shield,
  Activity,
  Power,
  PowerOff,
  MoreHorizontal,
  Filter,
  Search,
  TrendingUp,
  Clock,
  Eye,
} from "lucide-react";
import { AddUserForm } from "@/features/users/form/add_user-form";
import { ExportUsersButton } from "@/features/users/button/ExportUsersButton";
import UsersListTable from "@/features/users/table/UserManagement";
import ActivityLogs from "@/features/users/table/ActivityLogs";
import type { User } from "@/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showBulkStatusDialog, setShowBulkStatusDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<
    "delete" | "enable" | "disable" | null
  >(null);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [quickSearchTerm, setQuickSearchTerm] = useState("");

  const handleUserAdded = () => {
    setRefreshKey((prev) => prev + 1);
    toast.success("User management refreshed", {
      description: "The user list has been updated with the latest data",
    });
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedUserIds(ids);
  };

  const handleUsersData = (usersData: User[]) => {
    setUsers(usersData);
  };

  const selectedUsers = users.filter((user) =>
    selectedUserIds.includes(user.id)
  );

  const handleBulkDelete = async () => {
    try {
      setBulkActionLoading(true);

      // Simulate bulk delete operation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Users deleted successfully", {
        description: `${selectedUserIds.length} user(s) have been removed from the system`,
      });

      setSelectedUserIds([]);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to delete users", {
        description: "An error occurred while deleting the selected users",
      });
    } finally {
      setBulkActionLoading(false);
      setShowBulkDeleteDialog(false);
      setBulkAction(null);
    }
  };

  const handleBulkStatusChange = async (action: "enable" | "disable") => {
    try {
      setBulkActionLoading(true);

      // Simulate bulk status change operation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const actionText = action === "enable" ? "enabled" : "disabled";
      toast.success(`Users ${actionText} successfully`, {
        description: `${selectedUserIds.length} user(s) have been ${actionText}`,
      });

      setSelectedUserIds([]);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      toast.error(`Failed to ${action} users`, {
        description: `An error occurred while ${
          action === "enable" ? "enabling" : "disabling"
        } the selected users`,
      });
    } finally {
      setBulkActionLoading(false);
      setShowBulkStatusDialog(false);
      setBulkAction(null);
    }
  };

  const openBulkActionDialog = (action: "delete" | "enable" | "disable") => {
    setBulkAction(action);
    if (action === "delete") {
      setShowBulkDeleteDialog(true);
    } else {
      setShowBulkStatusDialog(true);
    }
  };

  const getActionText = () => {
    switch (bulkAction) {
      case "enable":
        return "Enable";
      case "disable":
        return "Disable";
      case "delete":
        return "Delete";
      default:
        return "Action";
    }
  };

  const getActionIcon = () => {
    switch (bulkAction) {
      case "enable":
        return <Power className="h-4 w-4" />;
      case "disable":
        return <PowerOff className="h-4 w-4" />;
      case "delete":
        return <Trash2 className="h-4 w-4" />;
      default:
        return <MoreHorizontal className="h-4 w-4" />;
    }
  };

  const getActionDescription = () => {
    switch (bulkAction) {
      case "enable":
        return "enable and grant access to";
      case "disable":
        return "disable and revoke access from";
      case "delete":
        return "permanently delete";
      default:
        return "perform action on";
    }
  };

  // Statistics for dashboard cards
  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    selected: selectedUserIds.length,
    recentlyAdded: users.filter((u) => {
      const createdDate = new Date(u.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length,
  };

  const filteredUsers = users.filter((user) =>
    quickSearchTerm
      ? `${user.first_name} ${user.last_name} ${user.email}`
          .toLowerCase()
          .includes(quickSearchTerm.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header Section */}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold mt-1">{userStats.total}</p>
                  <p className="text-blue-100 text-xs mt-1">System wide</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Users className="h-20 w-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold mt-1">{userStats.active}</p>
                  <p className="text-green-100 text-xs mt-1">
                    Currently online
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <CheckCircle2 className="h-20 w-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">
                    Inactive Users
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {userStats.inactive}
                  </p>
                  <p className="text-amber-100 text-xs mt-1">Needs attention</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <AlertTriangle className="h-20 w-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Selected
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {userStats.selected}
                  </p>
                  <p className="text-purple-100 text-xs mt-1">
                    For bulk actions
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Shield className="h-20 w-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">
                    New This Week
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {userStats.recentlyAdded}
                  </p>
                  <p className="text-indigo-100 text-xs mt-1">Recently added</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <TrendingUp className="h-20 w-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <TabsList className="grid w-full grid-cols-2 lg:w-[500px] bg-transparent p-1 m-4">
                  <TabsTrigger
                    value="users"
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Users className="h-4 w-4" />
                    User Management
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filteredUsers.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="logs"
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Activity className="h-4 w-4" />
                    Activity Logs
                    <Badge variant="secondary" className="ml-2 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="users" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      User Directory
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {quickSearchTerm
                        ? `Showing ${filteredUsers.length} of ${users.length} users matching "${quickSearchTerm}"`
                        : `Managing ${users.length} total users in the system`}
                    </p>
                  </div>
                  {/* Enhanced Action Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:w-96">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Enhanced Selection Summary */}
                      {selectedUserIds.length > 0 && (
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 px-3 py-1"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {selectedUserIds.length} selected
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUserIds([])}
                            className="text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            Clear selection
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <AddUserForm
                      onUserAdded={handleUserAdded}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5"
                    />

                    <ExportUsersButton
                      selectedUserIds={selectedUserIds}
                      users={users}
                      className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200"
                    />

                    {selectedUserIds.length > 0 && (
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-slate-300 dark:border-slate-600 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <MoreHorizontal className="h-4 w-4 mr-2" />
                              Bulk Actions ({selectedUserIds.length})
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="w-56 shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm"
                          >
                            <DropdownMenuLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Bulk Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openBulkActionDialog("enable")}
                              className="cursor-pointer text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              <Power className="mr-3 h-4 w-4" />
                              Enable Selected Users
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openBulkActionDialog("disable")}
                              className="cursor-pointer text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            >
                              <PowerOff className="mr-3 h-4 w-4" />
                              Disable Selected Users
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openBulkActionDialog("delete")}
                              className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="mr-3 h-4 w-4" />
                              Delete Selected Users
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    <Eye className="h-4 w-4" />
                    View Options
                  </Button> */}
                </div>
                <UsersListTable
                  key={refreshKey}
                  onSelectionChange={handleSelectionChange}
                  onUsersData={handleUsersData}
                />
              </TabsContent>

              <TabsContent value="logs" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Activity Logs
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Real-time monitoring of user management activities and
                      system events
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      Live Updates
                    </div>
                  </div>
                </div>
                <ActivityLogs />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Bulk Delete Confirmation Dialog */}
        <AlertDialog
          open={showBulkDeleteDialog}
          onOpenChange={setShowBulkDeleteDialog}
        >
          <AlertDialogContent className="sm:max-w-[600px] border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                Confirm Bulk Delete
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4 text-base">
                <p className="text-slate-700 dark:text-slate-300">
                  Are you sure you want to{" "}
                  <strong className="text-red-600 dark:text-red-400">
                    permanently delete
                  </strong>{" "}
                  {selectedUserIds.length} selected user(s)?
                </p>
                <Card className="bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Users to be deleted:
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between text-sm p-2 bg-white/50 dark:bg-slate-800/50 rounded-md"
                      >
                        <span className="font-medium">
                          • {user.first_name} {user.last_name}
                        </span>
                        <span className="text-muted-foreground">
                          ({user.email})
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    This action cannot be undone and will permanently remove all
                    user data and access permissions.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel
                disabled={bulkActionLoading}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                disabled={bulkActionLoading}
                className="bg-red-600 hover:bg-red-700 text-white min-w-[140px] shadow-lg"
              >
                {bulkActionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Users
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Status Change Confirmation Dialog */}
        <AlertDialog
          open={showBulkStatusDialog}
          onOpenChange={setShowBulkStatusDialog}
        >
          <AlertDialogContent className="sm:max-w-[600px] border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-3 text-xl">
                <div
                  className={`p-2 rounded-lg ${
                    bulkAction === "enable"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-amber-100 dark:bg-amber-900/30"
                  }`}
                >
                  {getActionIcon()}
                </div>
                Confirm Bulk {getActionText()}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4 text-base">
                <p className="text-slate-700 dark:text-slate-300">
                  Are you sure you want to{" "}
                  <strong>{getActionDescription()}</strong>{" "}
                  {selectedUserIds.length} selected user(s)?
                </p>
                <Card className="bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Affected users:
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between text-sm p-2 bg-white/50 dark:bg-slate-700/50 rounded-md"
                      >
                        <span className="font-medium">
                          • {user.first_name} {user.last_name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              user.status === "active" ? "default" : "secondary"
                            }
                            className={`text-xs ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {user.status}
                          </Badge>
                          <span className="text-muted-foreground">
                            ({user.email})
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <div
                  className={`p-4 rounded-lg border ${
                    bulkAction === "enable"
                      ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                      : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      bulkAction === "enable"
                        ? "text-green-700 dark:text-green-400"
                        : "text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {bulkAction === "enable"
                      ? "Users will be able to access the system and perform their assigned roles after enabling."
                      : "Users will lose access to the system and cannot perform any actions after disabling."}
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel
                disabled={bulkActionLoading}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  handleBulkStatusChange(bulkAction as "enable" | "disable")
                }
                disabled={bulkActionLoading}
                className={`min-w-[140px] shadow-lg ${
                  bulkAction === "enable"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-amber-600 hover:bg-amber-700"
                } text-white`}
              >
                {bulkActionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {getActionText()}ing...
                  </>
                ) : (
                  <>
                    {getActionIcon()}
                    <span className="ml-2">{getActionText()} Users</span>
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
