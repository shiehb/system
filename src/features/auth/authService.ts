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
      const message = "Please enter both email and password";
      toast.error("Login Failed", {
        description: message,
        duration: 5000,
      });
      throw new Error(message);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const message = "Please enter a valid email address";
      toast.error("Login Failed", {
        description: message,
        duration: 5000,
      });
      throw new Error(message);
    }

    try {
      await apiLogin(email.trim().toLowerCase(), password);
      await loginUser(email.trim().toLowerCase(), password);
      toast.success("Welcome back!", {
        description: "You have been successfully logged in.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes("invalid credentials")) {
        errorMessage =
          "Invalid email or password. Please check your credentials and try again.";
      } else if (errorMessage.toLowerCase().includes("account")) {
        errorMessage =
          "There's an issue with your account. Please contact support.";
      } else if (errorMessage.toLowerCase().includes("network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      toast.error("Login Failed", {
        description: errorMessage,
        duration: 5000,
      });
      throw error;
    }
  },

  async requestPasswordReset(email: string) {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      const message = "Please enter your email address";
      toast.error("Password Reset Failed", {
        description: message,
        duration: 5000,
      });
      throw new Error(message);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      const message = "Please enter a valid email address";
      toast.error("Password Reset Failed", {
        description: message,
        duration: 5000,
      });
      throw new Error(message);
    }

    try {
      await requestPasswordReset(trimmedEmail);
      toast.success("OTP Sent Successfully", {
        description:
          "If an account with this email exists, you'll receive an OTP code shortly. Please check your email and spam folder.",
        duration: 8000,
      });
    } catch (error) {
      console.error("Password reset request error:", error);
      let errorMessage = "Failed to send password reset email";

      if (error instanceof Error) {
        if (error.message.toLowerCase().includes("rate limit")) {
          errorMessage =
            "Too many requests. Please wait a few minutes before trying again.";
        } else if (error.message.toLowerCase().includes("network")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.toLowerCase().includes("server")) {
          errorMessage =
            "Server error. Please try again later or contact support.";
        }
      }

      toast.error("Password Reset Failed", {
        description: errorMessage,
        duration: 5000,
      });
      throw error;
    }
  },

  async verifyPasswordReset(email: string, otp: string, newPassword: string) {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail || !trimmedOtp || !newPassword) {
      const message = "Please fill in all required fields";
      toast.error("Password Reset Failed", {
        description: message,
        duration: 5000,
      });
      throw new Error(message);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      const message = "Please enter a valid email address";
      toast.error("Password Reset Failed", {
        description: message,
        duration: 5000,
      });
      throw new Error(message);
    }

    // Validate OTP format (should be 6 digits)
    if (!/^\d{6}$/.test(trimmedOtp)) {
      const message = "OTP must be a 6-digit number";
      toast.error("Invalid OTP", {
        description: message,
        duration: 5000,
      });
      throw new Error(message);
    }

    // Validate password strength
    if (newPassword.length < 8) {
      const message = "Password must be at least 8 characters long";
      toast.error("Weak Password", {
        description: message,
        duration: 5000,
      });
      throw new Error(message);
    }

    try {
      const response = await verifyPasswordReset(
        trimmedEmail,
        trimmedOtp,
        newPassword
      );

      toast.success("Password Reset Successful", {
        description:
          "Your password has been successfully reset. You can now login with your new password.",
        duration: 5000,
      });

      return response;
    } catch (error: any) {
      console.error("Verify password reset error:", error);
      let errorMessage = "Failed to reset password";

      if (error.response?.data) {
        const apiError = error.response.data;
        if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.error) {
          errorMessage = apiError.error;
        } else if (apiError.detail) {
          errorMessage = apiError.detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific error cases
      if (
        errorMessage.toLowerCase().includes("invalid") &&
        errorMessage.toLowerCase().includes("otp")
      ) {
        errorMessage = "Invalid or expired OTP. Please request a new one.";
      } else if (errorMessage.toLowerCase().includes("expired")) {
        errorMessage =
          "Your OTP has expired. Please request a new password reset.";
      } else if (errorMessage.toLowerCase().includes("not found")) {
        errorMessage = "No account found with this email address.";
      } else if (errorMessage.toLowerCase().includes("rate limit")) {
        errorMessage = "Too many attempts. Please wait before trying again.";
      }

      toast.error("Password Reset Failed", {
        description: errorMessage,
        duration: 5000,
      });
      throw error;
    }
  },
};
