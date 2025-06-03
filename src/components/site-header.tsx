import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { logout, getMyProfile } from '@/endpoints/api';
import { NavUser } from "@/components/nav-user";
import { NavigationMenuDemo } from "@/components/nav-menu"
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@radix-ui/react-separator";
import { Link } from "react-router-dom";

export function SiteHeader() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

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

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 px-4 cursor-pointer"
          aria-label="Go to dashboard"
        >
          <img src="/assets/DENR-Logo.svg" className="h-8 w-8" alt="DENR Logo" />
          {!isMobile && (
            <div className="grid text-left text-sm leading-tight select-none">
              <span className="truncate text-xs font-medium">Integrated Establishment Regulatory</span>
              <span className="truncate text-xs">Management System</span>
            </div>
          )}
        </Link>
        
        <div className="flex-grow flex justify-center">
          <NavigationMenuDemo userLevel={profile?.user_level} />
          <Separator className="my-2" />   
        </div>
        
        <div className="flex items-center gap-2 px-2">
          <NotificationDropdown /> 
          <div className="flex items-center">
            <NavUser 
              user={{
                name: profile ? `${profile.first_name} ${profile.last_name}` : 'User',
                email: profile?.email || 'user@example.com',
                avatar: profile?.avatar_url || ''
              }}
              onProfileClick={() => navigate("/profile")}
              onSettingsClick={() => navigate("/settings")}
              onLogoutClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </header>
  )
}