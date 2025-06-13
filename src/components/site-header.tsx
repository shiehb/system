import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { Separator } from "@/components/ui/separator";
import { logout, getMyProfile } from "@/endpoints/api";
import { NavUser } from "@/components/nav-user";
import { NavigationMenuDemo } from "@/components/nav-menu";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Home,
  Map,
  Building2,
  ClipboardList,
  FileText,
  Users,
} from "lucide-react";

export function SiteHeader() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
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

      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch {
      toast.error("Logout failed.", {
        description: "Please try again.",
      });
    }
  };

  // Mobile navigation items with icons
  const mobileNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Maps", path: "/maps", icon: Map },
    { name: "Establishments", path: "/establishments", icon: Building2 },
    { name: "Inspection", path: "/schedule", icon: ClipboardList },
    { name: "Reports", path: "/reports", icon: FileText },
    ...(profile?.user_level === "admin"
      ? [{ name: "Users", path: "/user-management", icon: Users }]
      : []),
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] flex flex-col">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 p-4 pb-0 cursor-pointer"
              aria-label="Go to dashboard"
            >
              <img
                src="/assets/DENR-Logo.svg"
                className="size-10"
                alt="DENR Logo"
              />
              <div className="grid text-left text-sm select-none">
                <span className="truncate text-xs font-medium">
                  Integrated Establishment Regulatory
                </span>
                <span className="truncate text-xs">Management System</span>
              </div>
            </Link>

            {/* Separator */}
            <Separator />

            {/* Main Navigation */}
            <nav className="flex-1 flex flex-col space-y-2">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-6 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors gap-3 text-sm font-medium"
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            {/* User Menu */}
            <SheetFooter>
              <NavUser
                user={{
                  name: profile
                    ? `${profile.first_name} ${profile.last_name}`
                    : "User",
                  email: profile?.email || "user@example.com",
                  avatar: profile?.avatar_url || "",
                }}
                onProfileClick={() => navigate("/profile")}
                onSettingsClick={() => navigate("/settings")}
                onLogoutClick={handleLogout}
              />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Header */}
      <header className="bg-background sticky top-0 z-40 flex w-full items-center border-b border-foreground">
        <div className="flex h-(--header-height) w-full items-center gap-2 px-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-12 md:px-4 md:min-w-20 lg:min-w-70 cursor-pointer"
            aria-label="Go to dashboard"
          >
            <img
              src="/assets/DENR-Logo.svg"
              className="size-8"
              alt="DENR Logo"
            />
            <div className="grid md:hidden lg:grid text-left text-sm select-none">
              <span className="truncate text-xs font-medium">
                Integrated Establishment Regulatory
              </span>
              <span className="truncate text-xs">Management System</span>
            </div>
          </Link>

          <div className="hidden md:flex flex-grow justify-center">
            <NavigationMenuDemo userLevel={profile?.user_level} />
          </div>

          <div className="flex items-center gap-2 px-2 ml-auto">
            <NotificationDropdown />
            <div className="flex items-center hidden md:block">
              <NavUser
                user={{
                  name: profile
                    ? `${profile.first_name} ${profile.last_name}`
                    : "User",
                  email: profile?.email || "user@example.com",
                  avatar: profile?.avatar_url || "",
                }}
                onProfileClick={() => navigate("/profile")}
                onSettingsClick={() => navigate("/settings")}
                onLogoutClick={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
