import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { LoadingWave } from "@/components/ui/loading-wave";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingWave message="Authenticating..." />;
  }

  if (isAuthenticated) {
    // Redirect authenticated users to dashboard (or their intended path)
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children; // Allow access if not authenticated
};
