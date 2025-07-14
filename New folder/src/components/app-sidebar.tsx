import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { getMyProfile } from "@/lib/api";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/useAuth";
import { type User, type UserLevel } from "@/types";
import { type NavItem } from "@/types/sidebar-types";
import {
  LayoutDashboard,
  Map,
  Building,
  ClipboardList,
  BarChart,
  Users,
  Plus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  const managementLevels: UserLevel[] = [
    "administrator",
    "division_chief",
    "eia_air_water_section_chief",
    "toxic_hazardous_section_chief",
    "solid_waste_section_chief",
  ];

  const inspectionLevels: UserLevel[] = [
    "eia_monitoring_personnel",
    "air_quality_monitoring_personnel",
    "water_quality_monitoring_personnel",
    "toxic_chemicals_monitoring_personnel",
    "solid_waste_monitoring_personnel",
    ...managementLevels,
  ];

  const isManagementLevel = useCallback(
    (level: UserLevel | undefined): boolean => {
      return level ? managementLevels.includes(level) : false;
    },
    [managementLevels]
  );

  const isInspectionLevel = useCallback(
    (level: UserLevel | undefined): boolean => {
      return level ? inspectionLevels.includes(level) : false;
    },
    [inspectionLevels]
  );

  const isChiefLevel = useCallback((level: UserLevel | undefined): boolean => {
    const chiefLevels: UserLevel[] = [
      "division_chief",
      "eia_air_water_section_chief",
      "toxic_hazardous_section_chief",
      "solid_waste_section_chief",
    ];
    return level ? chiefLevels.includes(level) : false;
  }, []);

  const getNavItems = useCallback((): NavItem[] => {
    const currentPath = location.pathname;
    const baseItems: NavItem[] = [
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
    ];

    // Show Inspection only for inspection-level users who are NOT admin
    if (
      isInspectionLevel(user?.user_level) &&
      user?.user_level !== "administrator"
    ) {
      baseItems.push({
        title: "Inspection",
        url: "/inspection",
        icon: ClipboardList,
        isActive: currentPath.startsWith("/inspection"),
      });
    }

    // Show Establishments in main nav for all roles except admin
    if (user?.user_level !== "administrator") {
      baseItems.push({
        title: "Establishments",
        url: "/establishments",
        icon: Building,
        isActive: currentPath.startsWith("/establishments"),
      });
    }

    // Only show Reports to chiefs
    if (isChiefLevel(user?.user_level)) {
      baseItems.push({
        title: "Reports",
        url: "/reports",
        icon: BarChart,
        isActive: currentPath.startsWith("/reports"),
        items: [
          {
            title: "Report Overview",
            url: "/reports",
            icon: BarChart,
          },
        ],
      });
    }

    return baseItems;
  }, [location.pathname, user?.user_level, isInspectionLevel, isChiefLevel]);

  const getManagementItems = useCallback((): NavItem[] => {
    const currentPath = location.pathname;
    const managementItems: NavItem[] = [];

    // Show Establishments in management section only for admin
    if (user?.user_level === "administrator") {
      managementItems.push({
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
      });

      // User Management remains admin-only
      managementItems.push({
        title: "User Management",
        url: "/user-management",
        icon: Users,
        isActive: currentPath.startsWith("/user-management"),
      });
    }

    return managementItems;
  }, [location.pathname, user?.user_level]);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-14 grid grid-cols-[100%]">
        <div className="flex items-center gap-2 min-w-[32px]">
          <img
            src="/assets/DENR-Logo.svg"
            className="size-8 shrink-0"
            alt="DENR Logo"
          />
          <div className="transition-all duration-300 overflow-hidden data-[collapsed=true]:w-0 data-[collapsed=true]:opacity-0">
            <div className="text-xs font-medium whitespace-nowrap">
              Integrated Establishment Regulatory
            </div>
            <div className="text-xs font-medium whitespace-nowrap">
              Management System
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={getNavItems()} managementItems={getManagementItems()} />
      </SidebarContent>
      <SidebarFooter className="md:hidden">
        <NavUser
          user={{
            name: profile
              ? `${profile.first_name} ${profile.last_name}`
              : "User",
            email: profile?.email || "user@example.com",
            avatar: profile?.avatar_url || "",
          }}
          onProfileClick={() => navigate("/profile")}
          onLogoutClick={logout}
          loading={loading}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
