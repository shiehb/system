import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import UsersListTable from "@/components/table/UserManagement";
import ActivityLogs from "@/components/table/ActivityLogs";
import { AddUserForm } from "@/components/form/add_user-form";
import ExportUsersButton from "@/components/report/ExportUsersButton";

export default function Page() {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const handleUserAdded = () => {
    // Handle user added logic
  };

  const handleUserSelection = (ids: number[]) => {
    setSelectedUserIds(ids);
  };

  const handleUsersData = (usersData: any[]) => {
    setUsers(usersData);
  };

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />

        <div className="relative p-6">
          {/* Conditionally render the button only when users tab is active */}
          {activeTab === "users" && (
            <div className="absolute flex right-6 top-6 gap-2 ">
              {/* Export button */}
              <ExportUsersButton
                selectedUserIds={selectedUserIds}
                users={users}
              />

              {/* Add user button */}
              <Button
                asChild
                className="w-fit transition duration-150 ease-in hover:scale-95 text-foreground border-1 border-foreground"
                aria-label="Add new user"
              >
                <AddUserForm
                  className="select-none cursor-pointer"
                  onUserAdded={handleUserAdded}
                />
              </Button>
            </div>
          )}

          {/* Selectable tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              aria-label="User management sections"
              className="border-foreground border-1 w-fit"
            >
              <TabsTrigger
                value="users"
                className={`cursor-pointer transition duration-300 ease-in ${
                  activeTab === "users"
                    ? "text-foreground border-1 border-foreground"
                    : ""
                }`}
                aria-selected={activeTab === "users"}
                aria-controls="users-content"
              >
                User Management
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className={`cursor-pointer transition duration-300 ease-in ${
                  activeTab === "logs"
                    ? "text-foreground border-1 border-foreground"
                    : ""
                }`}
                aria-selected={activeTab === "logs"}
                aria-controls="logs-content"
              >
                Activity Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="users"
              id="users-content"
              role="tabpanel"
              aria-labelledby="users-tab"
              tabIndex={0}
            >
              <UsersListTable
                onSelectionChange={handleUserSelection}
                onUsersData={handleUsersData}
              />
            </TabsContent>

            <TabsContent
              value="logs"
              id="logs-content"
              role="tabpanel"
              aria-labelledby="logs-tab"
              tabIndex={0}
            >
              <ActivityLogs />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarProvider>
    </div>
  );
}
