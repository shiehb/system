import type { ReactNode } from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  is_authenticated,
  login,
  register,
  logout as apiLogout,
  getMyProfile,
} from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { type User, type UserLevel } from "@/types";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const get_authenticated = useCallback(async () => {
    try {
      const success = await is_authenticated();
      if (success) {
        const userData = await getMyProfile();
        setUser(userData);
      }
      setIsAuthenticated(success);
      setAuthError(null);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      toast.error("Session expired. Please login again.", {
        description: "Your session has ended due to inactivity.",
        duration: 5000,
      });
      setAuthError("Session expired. Please login again.");
      setTimeout(() => navigate("/login"), 100);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    get_authenticated();
  }, [get_authenticated, location.pathname]);

  const login_user = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await login(email, password);

      if (response.success) {
        const userData = await getMyProfile();
        setUser(userData);
        setIsAuthenticated(true);
        setAuthError(null);
        navigate(location.state?.from?.pathname || "/dashboard");
      } else {
        throw new Error(response.message || "Invalid credentials");
      }

      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register_user = async (
    email: string,
    first_name: string,
    last_name: string,
    middle_name: string,
    password: string,
    user_level: UserLevel,
    status: "active" | "inactive"
  ) => {
    try {
      const response = await register({
        email,
        first_name,
        last_name,
        middle_name,
        password,
        user_level,
        status,
      });

      if (response.success) {
        toast.success("Registration successful!");
        return response;
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        login_user,
        register_user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
