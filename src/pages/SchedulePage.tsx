import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import  ScheduleCalendar  from "@/components/inspection/scheduleing"

export default function ProfilePage() {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">

            <div className="flex flex-1 flex-col gap-4 p-4">
              <ScheduleCalendar/>
            </div>

        </div>
      </SidebarProvider>
    </div>
  )
}
