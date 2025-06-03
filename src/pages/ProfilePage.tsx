import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ProfileInfo } from "@/components/users/Profile"

export default function ProfilePage() {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
            <div className="container mx-auto px-4 py-6 md:px-8 lg:px-12">
              <ProfileInfo/>
            </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
