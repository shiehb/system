import { useEffect, useState, useCallback, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { is_authenticated, login, register } from "../endpoints/api";
import { AuthContext } from "./AuthContext";
import { toast } from "sonner";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

const get_authenticated = useCallback(async () => {
  try {
    const success = await is_authenticated();
    setIsAuthenticated(success);
    setAuthError(null);
  } catch {
    setIsAuthenticated(false);

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

  const login_user = async (id_number: string, password: string) => {
    try {
      setLoading(true);
      const response = await login(id_number, password);

      if (response.success) {
        setIsAuthenticated(true);
        setAuthError(null);
        navigate(location.state?.from?.pathname || "/dashboard");
      } else {
        throw new Error(response.message || "Invalid credentials");
      }

      return response;
    } catch (error) {
      setIsAuthenticated(false);
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register_user = async (
    id_number: string,
    first_name: string,
    last_name: string,
    middle_name: string,
    email: string,
    password: string,
    cPassword: string,
    user_level: string,
    status: string
  ) => {
    if (password && cPassword && password !== cPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await register(
        id_number,
        first_name,
        last_name,
        middle_name,
        email,
        password || "",
        user_level,
        status
      );

      if (response.success) {
        alert("Registration successful!");
      } else {
        alert(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login_user,
        register_user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
