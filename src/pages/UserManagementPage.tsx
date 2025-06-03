import { useState } from 'react';
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import UsersListTable  from "@/components/table/userslist-table"
import ActivityLogs from "@/components/ActivityLogs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page() {
const [activeTab, setActiveTab] = useState('users');
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  
                  <TabsTrigger value="users">User Management</TabsTrigger>
                  <TabsTrigger value="logs">Activity Logs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="users">
                  <UsersListTable/>
                </TabsContent>
                
                <TabsContent value="logs">
                  <ActivityLogs />
                </TabsContent>

              </Tabs>
            </div>
            {/* <div>
              <Button asChild className="flex items-center gap-2">
                <AddUserForm onUserAdded={handleUserAdded} />
              </Button>
            </div> */}
      </SidebarProvider>
    </div>
  )
}
