import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchForm } from "@/components/search-form";
import { Separator } from "@/components/ui/separator";
import { UserDropdown } from "@/components/user-dropdown";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-background sticky top-0 z-40 flex h-16 w-full items-center border-b">
      <div className="flex h-full items-center">
        <SidebarTrigger className="ml-2 p-4 size-10" />
        <Separator orientation="vertical" className="mx-2" />
      </div>

      <SearchForm className="md:w-[500px]" />

      <div className="ml-auto flex items-center gap-2 px-2">
        <NotificationDropdown />
        <div className="hidden md:flex">
          <UserDropdown
            user={{
              name: user ? `${user.first_name} ${user.last_name}` : "User",
              email: user?.email || "user@example.com",
              avatar: user?.avatar_url || "",
            }}
            onProfileClick={() => navigate("/profile")}
            onLogout={logout}
            variant="header"
          />
        </div>
      </div>
    </header>
  );
}
