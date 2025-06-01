import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { ChartPieLabel } from "@/components/dashboard/ChartPie"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { DataCards } from "@/components/dashboard/data-cards"
// import { VisualizationCharts } from "@/components/dashboard/visualization-charts"

export default function Page() {
  return (
    <div className="[--header-height:calc(theme(spacing.14))] min-h-screen bg-muted/20">
      <SidebarProvider className="flex flex-col">
        {/* Top Header */}
        <SiteHeader />

        <div className="flex flex-1">
          {/* Sidebar Navigation */}
          <AppSidebar />

          <SidebarInset>
            <div className="flex flex-1 flex-col gap-6 p-4">

              {/* Metric Cards */}
              <DataCards />

              {/* Charts Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ChartPieLabel />
                <ActivityFeed/>
              </div>

            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
