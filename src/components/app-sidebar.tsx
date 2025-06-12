import * as React from "react";
import { useNavigate } from "react-router-dom";
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
  Frame,
} from "lucide-react";
// import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

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
      url: "/maps",
      icon: Map,
    },
    {
      title: "Establishments",
      url: "/establishments",
      icon: Building2,
      items: [
        {
          title: "All Establishments",
          url: "/establishments",
        },
        {
          title: "Add New Establishment",
          url: "/establishments/new",
        },
      ],
    },
    {
      title: "Inspection",
      url: "/inspection",
      icon: MapPinHouse,
      items: [
        {
          title: "All Inspections",
          url: "/inspection",
        },
        {
          title: "New Inspection",
          url: "/inspection/new",
        },
        {
          title: "Inspection Schedule",
          url: "/schedule",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileLineChart,
      items: [
        {
          title: "View Reports",
          url: "/reports",
        },
        {
          title: "Generate Report",
          url: "/reports/generate",
        },
      ],
    },
    {
      title: "Users",
      url: "/user-management",
      icon: User2,
      items: [
        {
          title: "All Users",
          url: "/user-management",
        },
        {
          title: "Add New User",
          url: "/add-user",
        },
        {
          title: "Profile",
          url: "/profile",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/projects/design-engineering",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/projects/sales-marketing",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/projects/travel",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarContent>
        {/* <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            onClick: () => handleNavigation(item.url),
            items: item.items?.map((subItem) => ({
              ...subItem,
              onClick: () => handleNavigation(subItem.url),
            })),
          }))}
        /> */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
