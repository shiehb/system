import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"
import { SearchForm } from "@/components/search-form"
import { LoadingWave } from "@/components/ui/loading-wave";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import {  Settings, LogOut, User, ChevronDown, SidebarIcon } from "lucide-react"

import { logout, getMyProfile } from '@/endpoints/api'; // Add getMyProfile import

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null); // State to store user profile
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch user profile on component mount
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
    setProfile(null); // Clear profile on logout
    
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
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <a href="/dashboard" className="flex items-center gap-2 px-4">
            <img src="/assets/DENR-Logo.svg" className="h-8" />
            <div className="grid text-left text-sm leading-tight">
              <span className="truncate text-xs font-medium">Integrated Establishment Regulatory</span>
              <span className="truncate text-xs">Management System</span>
            </div>
          </a>

        <SearchForm className="w-full sm:ml-auto sm:w-auto sm:w-[400px]" />
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 flex items-center gap-2">
                {loading ? (
                  <LoadingWave message="Loading..." />
                ) : (
                  <>
                    <Avatar className="h-8 w-8">
                      {/* Use actual user's avatar */}
                      <AvatarImage className="  object-cover"
                        src={profile?.avatar_url || {}} 
                        alt={`${profile?.first_name} ${profile?.last_name}`} 
                      />
                      {/* Fallback to initials if avatar not available */}
                      <AvatarFallback className="rounded-lg">
                        {profile 
                          ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`
                          : 'CN'
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex md:flex-col md:items-start md:leading-none">
                      {/* Show actual user name */}
                      <span className="text-sm font-medium">
                        {profile 
                          ? `${profile.first_name} ${profile.last_name}` 
                          : 'User'
                        }
                      </span>
                      {/* Show actual user email */}
                      <span className="text-xs text-muted-foreground">
                        {profile?.email || 'user@example.com'}
                      </span>
                    </div>
                  </>
                )}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </header>
  )
}