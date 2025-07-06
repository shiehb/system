import { toast } from "sonner";
import {
  login as apiLogin,
  requestPasswordReset,
  verifyPasswordReset,
} from "@/lib/api";

interface AuthService {
  login: (
    email: string,
    password: string,
    loginUser: (email: string, password: string) => Promise<void>
  ) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyPasswordReset: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;
}

export const authService: AuthService = {
  async login(email, password, loginUser) {
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password", {
        duration: 5000,
      });
      throw new Error("Please enter both email and password");
    }

    try {
      await apiLogin(email, password);
      await loginUser(email, password);
      toast.success("Login Successful", {
        duration: 5000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Login Failed", {
        description: errorMessage,
        duration: 5000,
      });
      throw error;
    }
  },

  async requestPasswordReset(email: string) {
    if (!email.trim()) {
      toast.error("Please enter your email address", {
        duration: 5000,
      });
      throw new Error("Please enter your email address");
    }

    try {
      await requestPasswordReset(email);
      toast.success("If this email exists, you'll receive an OTP shortly", {
        duration: 5000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Password reset request failed", {
        description: errorMessage,
        duration: 5000,
      });
      throw error;
    }
  },
  async verifyPasswordReset(email: string, otp: string, newPassword: string) {
    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      toast.error("Please fill all fields");
      throw new Error("Please fill all fields");
    }

    try {
      const response = await verifyPasswordReset(
        email.toLowerCase(),
        otp,
        newPassword
      );
      toast.success(
        "Password reset successfully. You can now login with your new password."
      );
      return response;
    } catch (error: any) {
      console.error("Verify password reset error:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred";

      toast.error("Password reset failed", {
        description: errorMessage,
      });
      throw error;
    }
  },
};
