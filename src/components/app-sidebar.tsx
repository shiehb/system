import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { logout, getMyProfile } from "@/lib/api";
import { useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Map,
  Building,
  ClipboardList,
  BarChart,
  Users,
  PieChart,
  Briefcase,
  Plus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getNavItems = () => {
    const currentPath = location.pathname;

    return [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: currentPath.startsWith("/dashboard"),
      },
      {
        title: "Maps",
        url: "/maps",
        icon: Map,
        isActive: currentPath.startsWith("/maps"),
      },
      {
        title: "Establishments",
        url: "/establishments",
        icon: Building,
        isActive: currentPath.startsWith("/establishments"),
        items: [
          {
            title: "All Establishments",
            url: "/establishments",
            icon: Building,
          },
          {
            title: "Add Establishment",
            url: "/establishments/add",
            icon: Plus,
          },
        ],
      },
      {
        title: "Inspection",
        url: "/inspection",
        icon: ClipboardList,
        isActive: currentPath.startsWith("/inspection"),
        items: [
          {
            title: "Overview",
            url: "/inspection",
          },
        ],
      },
      {
        title: "Reports",
        url: "/reports",
        icon: BarChart,
        isActive: currentPath.startsWith("/reports"),
        items: [{ title: "Report Overview", url: "/reports" }],
      },
      {
        title: "User Management",
        url: "/user-management",
        icon: Users,
        isActive: currentPath.startsWith("/user-management"),
      },
    ];
  };

  const getProjectItems = () => {
    return [
      {
        name: "Main Project",
        url: "/projects/main",
        icon: Briefcase,
      },
      {
        name: "Sales & Marketing",
        url: "/projects/sales",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "/projects/travel",
        icon: Map,
      },
    ];
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setProfile(null);

      toast.success("You have been logged out.", {
        description: "Hope to see you again soon!",
        duration: 3000,
      });

      navigate("/login");
    } catch {
      toast.error("Logout failed.", {
        description: "Please try again.",
      });
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-14 pt-4 flex justify-end pr-4">
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavItems()} />
        <NavProjects projects={getProjectItems()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: profile
              ? `${profile.first_name} ${profile.last_name}`
              : "User",
            email: profile?.email || "user@example.com",
            avatar: profile?.avatar_url || "",
          }}
          onProfileClick={() => navigate("/profile")}
          onLogoutClick={handleLogout}
          loading={loading}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
