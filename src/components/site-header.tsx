import { toast } from "sonner";
import { useNavigate } from "react-router-dom"
import { SearchForm } from "@/components/search-form"
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
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import {  Settings, LogOut, User, ChevronDown, SidebarIcon } from "lucide-react"

import { logout } from '@/endpoints/api';


export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const navigate = useNavigate()


const handleLogout = async () => {
  try {
    await logout();

    // ✅ Show success toast before navigating
    toast.success("You have been logged out.", {
      description: "Hope to see you again soon!",
      duration: 3000,
    });

    // Optional: slight delay so the toast is visible before redirect
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
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>

        <Separator orientation="vertical" className="mr-2 h-4" />
        <a href="/dashboard" className="flex items-center gap-2">
            <img src="/assets/DENR-Logo.svg" className="h-8" />
            <div className="grid text-left text-sm leading-tight">
              <span className="truncate text-xs font-medium">Integrated Establishment Regulatory</span>
              <span className="truncate text-xs">MANAGEMENT SYSTEM</span>
            </div>
          </a>

        <SearchForm className="w-full sm:ml-auto sm:w-auto sm:w-[400px]" />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex md:flex-col md:items-start md:leading-none">
                  <span className="text-sm font-medium">User</span>
                  <span className="text-xs text-muted-foreground"> user@example.com</span>
                </div>
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
