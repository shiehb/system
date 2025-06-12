import { useAuth } from "../contexts/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingWave } from "@/components/ui/loading-wave";
import type { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingWave message="Loading..." />;
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
