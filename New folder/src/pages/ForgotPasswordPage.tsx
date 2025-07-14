import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSuccess = (email: string) => {
    navigate("/reset-password", {
      state: {
        email,
        lastEmailSent: Date.now(),
      },
      replace: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <Button
        variant="outline"
        className="absolute left-4 top-4 md:left-8 md:top-8 bg-transparent"
        asChild
      >
        <Link to="/login">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
      </Button>

      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col space-y-2 text-center mb-6">
          <div className="flex justify-center mb-2">
            <KeyRound className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-sm text-muted-foreground">
            No worries! Enter your email address and we'll send you an OTP to
            reset your password.
          </p>
        </div>

        <ForgotPasswordForm onSuccess={handleSuccess} />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
