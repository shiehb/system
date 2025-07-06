"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-dropdown";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onProfileClick?: () => void;
  onLogoutClick?: () => Promise<void>;
  loading?: boolean;
}

export function NavUser({
  user,
  onProfileClick,
  onLogoutClick,
  loading = false,
}: NavUserProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserDropdown
          user={user}
          onProfileClick={onProfileClick}
          onLogout={onLogoutClick}
          loading={loading}
          variant="sidebar"
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
