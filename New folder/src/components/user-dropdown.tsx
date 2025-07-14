"use client";

import { User, LogOut, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangePassword } from "@/features/password/edit_password";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onProfileClick?: () => void;
  onLogout?: () => Promise<void>;
  loading?: boolean;
  variant?: "sidebar" | "header";
  children?: React.ReactNode;
}

export function UserDropdown({
  user,
  onProfileClick,
  onLogout,
  loading = false,
  variant = "header",
  children,
}: UserDropdownProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = useCallback(async () => {
    if (!onLogout) return;

    setIsLoggingOut(true);
    try {
      await onLogout();
      toast.success("You've been logged out", {
        description: "Your session has ended securely",
        duration: 5000,
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed", {
        description: "Couldn't end your session. Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  }, [onLogout, navigate]);

  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={loading || isLoggingOut}>
          {children || (
            <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100">
              <Avatar className="h-8 w-8 rounded-full">
                {!loading && user.avatar && (
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="rounded-full">
                  {loading || isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    getInitials(user.name)
                  )}
                </AvatarFallback>
              </Avatar>
              {variant === "sidebar" && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {loading ? "Loading..." : user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {loading ? "loading..." : user.email}
                  </span>
                </div>
              )}
            </button>
          )}
        </DropdownMenuTrigger>
        {!loading && (
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-50 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={8}
            collisionPadding={16}
          >
            <DropdownMenuLabel className="flex items-center gap-3">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-full">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <ChangePassword>
                <div className="flex items-center">Change Password</div>
              </ChangePassword>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 hover:text-red-600 bg-red-50"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="mr-2 h-4 w-4 text-red-600" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? Any unsaved changes might be
              lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-700"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                "Sign out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
