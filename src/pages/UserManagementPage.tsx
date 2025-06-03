import { useState } from 'react';
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import UsersListTable from "@/components/table/UserManagement"
import ActivityLogs from "@/components/table/ActivityLogs"
import { AddUserForm } from "@/components/form/add_user-form"; 

export default function Page() {
  const [activeTab, setActiveTab] = useState('users');

  const handleUserAdded = () => {
    // Handle user added logic
  };

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="relative p-6">
          {/* Conditionally render the button only when users tab is active */}
          {activeTab === 'users' && (
            <div className="absolute flex right-6 top-6">
              <Button 
                asChild 
                className="transition duration-700 ease-in-out hover:scale-110 hover:border-2"
                aria-label="Add new user"
              >
                <AddUserForm 
                  className='select-none cursor-pointer' 
                  onUserAdded={handleUserAdded} 
                />
              </Button>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList aria-label="User management sections">
              <TabsTrigger 
                value="users"
                className='cursor-pointer'
                aria-selected={activeTab === 'users'}
                aria-controls="users-content"
              >
                User Management
              </TabsTrigger>
              <TabsTrigger 
                value="logs"
                className='cursor-pointer'
                aria-selected={activeTab === 'logs'}
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
              <UsersListTable />
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
  )
}