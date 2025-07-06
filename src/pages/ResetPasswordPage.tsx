import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { authService } from "@/features/auth/authService";

const FormSchema = z
  .object({
    otp: z.string().min(6, {
      message: "OTP must be 6 characters",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Get email and lastEmailSent from location state
  const { email, lastEmailSent } = location.state || {
    email: "",
    lastEmailSent: null,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Initialize countdown from lastEmailSent when component mounts
  useEffect(() => {
    if (lastEmailSent) {
      const elapsedSeconds = Math.floor((Date.now() - lastEmailSent) / 1000);
      const remainingTime = Math.max(0, 120 - elapsedSeconds); // 2 minutes = 120 seconds

      if (remainingTime > 0) {
        setCountdown(remainingTime);
        setIsResendDisabled(true);
      }
    }
  }, [lastEmailSent]);

  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await authService.verifyPasswordReset(
        email.toLowerCase(),
        data.otp,
        data.newPassword
      );
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    }
  }

  async function handleResendOTP() {
    try {
      setIsResendDisabled(true);
      setCountdown(120); // Reset to 2 minutes
      await authService.requestPasswordReset(email.toLowerCase());
      toast.success("OTP has been resent to your email");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
      setIsResendDisabled(false);
    }
  }

  // Format countdown to MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Button
        variant="ghost"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        asChild
      >
        <Link to="/forgot-password">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <Card className="md:w-[400px] lg:w-[400px] md:mx-auto p-8 mx-auto">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the OTP sent to {email} and your new password
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-6"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="justify-center">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-14 w-14 text-3xl font-bold"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </Form>

        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          Didn't receive OTP?{" "}
          <Button
            variant="link"
            className="p-0 h-auto underline underline-offset-4 hover:text-primary"
            onClick={handleResendOTP}
            disabled={isResendDisabled}
          >
            Resend {isResendDisabled && `(${formatCountdown(countdown)})`}
          </Button>
        </p>
      </Card>
    </div>
  );
}
