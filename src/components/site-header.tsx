"use client";

import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchForm } from "@/components/search-form";
import { Separator } from "@/components/ui/separator";
import { UserDropdown } from "@/components/user-dropdown";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40 shadow-sm">
      <div className="flex h-16 items-center px-4">
        {/* Left Section - Sidebar Trigger */}
        <div className="flex items-center">
          <SidebarTrigger className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-200" />
          <Separator orientation="vertical" className="mx-3 h-6" />
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 flex justify-center px-4">
          <div
            className={`relative transition-all duration-300 ${
              searchFocused ? "w-full max-w-2xl" : "w-full max-w-md"
            }`}
          >
            <div className="relative">
              <SearchForm
                className=" bg-muted/50 border-0 rounded-full focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-accent/50 transition-colors duration-200"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-accent/50 transition-colors duration-200"
              onClick={() => navigate("/help")}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="mx-2 h-6 hidden md:block"
          />

          {/* Notifications */}
          <div className="relative">
            <NotificationDropdown />
          </div>

          {/* User Status Badge */}
          {user && (
            <div className="hidden lg:flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {user.user_level
                  ?.replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </Badge>
            </div>
          )}

          {/* User Dropdown - Desktop */}
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

          {/* Mobile User Menu */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-accent/50 transition-colors duration-200"
              onClick={() => navigate("/profile")}
            >
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <SearchForm className="pl-10 pr-4 h-9 bg-muted/50 border-0 rounded-full w-full" />
        </div>
      </div>
    </header>
  );
}
