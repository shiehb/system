import * as React from "react"
import {
  LayoutDashboard,
  User2,
  Settings2,
  Building2,
  MapPinHouse,
  FileLineChart,
  PieChart,
  LifeBuoy,
  Map,
  Frame
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
// import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: false,
    },
    {
      title: "Maps",
      url: "#",
      icon: Map,
    },
    {
      title: "Establishments",
      url: "#",
      icon: Building2,
      items: [
        {
          title: "All Establishments",
          url: "#",
        },
        {
          title: "Add New Establishment",
          url: "#",
        }
      ],
    },
        {
      title: "Inspection",
      url: "#",
      icon: MapPinHouse,
      items: [
        {
          title: "",
          url: "#",
        },
        {
          title: "",
          url: "#",
        }
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: FileLineChart,
      items: [
        {
          title: "",
          url: "#",
        },
        {
          title: "",
          url: "#",
        }
      ],
    },
    {
      title: "Users",
      url: "/user-management",
      icon: User2,
      items: [
        {
          title: "All Users",
          url: "#",
        },
        {
          title: "Add New User",
          url: "#",
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Profile",
          url: "#",
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
