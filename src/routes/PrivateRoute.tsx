import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { LoadingWave } from "@/components/ui/loading-wave";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingWave message="Loading..." />;
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
