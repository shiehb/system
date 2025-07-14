"use client";

import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { LoadingWave } from "@/components/ui/loading-wave";

interface PrivateRouteProps {
  children: JSX.Element;
  requiresPasswordReset?: boolean;
}

export const PrivateRoute = ({
  children,
  requiresPasswordReset = false,
}: PrivateRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingWave message="Authenticating..." />;
  }

  // Special handling for password reset route
  if (requiresPasswordReset) {
    // Allow access to reset password page if user came from forgot password
    const hasValidState =
      location.state?.email && location.state?.lastEmailSent;
    if (!hasValidState) {
      return <Navigate to="/forgot-password" replace />;
    }
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is using default password and not already on the change password page
  if (
    user?.using_default_password &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  return children;
};

// Create a specific component for password reset route protection
export const PasswordResetRoute = ({ children }: { children: JSX.Element }) => {
  return <PrivateRoute requiresPasswordReset={true}>{children}</PrivateRoute>;
};
