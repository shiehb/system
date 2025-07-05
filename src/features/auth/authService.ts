import { toast } from "sonner";

interface AuthService {
  login: (
    email: string,
    password: string,
    loginUser: (email: string, password: string) => Promise<void>
  ) => Promise<void>;
  handleForgotPassword: () => void;
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

  handleForgotPassword() {
    toast.error("Password Reset", {
      description:
        "Please contact your system administrator for password reset.",
      duration: 5000,
    });
  },
};
