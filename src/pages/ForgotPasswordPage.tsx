import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSuccess = (email: string) => {
    toast.success(`OTP sent to ${email}`);
    navigate("/reset-password", {
      state: {
        email,
        lastEmailSent: Date.now(),
      },
    });
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Button
        variant="ghost"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        asChild
      >
        <Link to="/login">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </Button>

      <Card className="md:w-[400px] lg:w-[400px] md:mx-auto p-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to receive a password reset OTP
          </p>
        </div>

        <div className="mt-6">
          <ForgotPasswordForm onSuccess={handleSuccess} />
        </div>

        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
