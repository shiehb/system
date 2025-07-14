"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  CheckCircle,
  Loader2,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/features/auth/authService";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

const FormSchema = z
  .object({
    otp: z
      .string()
      .min(6, "OTP must be 6 characters")
      .max(6, "OTP must be 6 characters"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof FormSchema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Get email and lastEmailSent from location state
  const { email, lastEmailSent } = location.state || {};

  // Redirect if no email is provided
  const redirectIfNoEmail = () => {
    if (!email) {
      return <Navigate to="/forgot-password" replace />;
    }
    return null;
  };

  const watchedPassword = form.watch("newPassword");

  // Calculate password strength
  useEffect(() => {
    if (!watchedPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (watchedPassword.length >= 8) strength += 20;
    if (/[A-Z]/.test(watchedPassword)) strength += 20;
    if (/[a-z]/.test(watchedPassword)) strength += 20;
    if (/[0-9]/.test(watchedPassword)) strength += 20;
    if (/[^A-Za-z0-9]/.test(watchedPassword)) strength += 20;

    setPasswordStrength(strength);
  }, [watchedPassword]);

  // Initialize countdown from lastEmailSent when component mounts
  useEffect(() => {
    if (lastEmailSent) {
      const elapsedSeconds = Math.floor((Date.now() - lastEmailSent) / 1000);
      const remainingTime = Math.max(0, 300 - elapsedSeconds); // 5 minutes = 300 seconds

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

  async function onSubmit(data: ResetPasswordFormData) {
    setIsSubmitting(true);
    try {
      await authService.verifyPasswordReset(
        email.toLowerCase(),
        data.otp,
        data.newPassword
      );

      toast.success(
        "Password reset successfully! You can now login with your new password."
      );
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Password reset failed:", error);
      // Error is already handled in authService with toast
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendOTP() {
    try {
      setIsResendDisabled(true);
      setCountdown(300); // 5 minutes
      await authService.requestPasswordReset(email.toLowerCase());
      toast.success("New OTP has been sent to your email");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setIsResendDisabled(false);
      setCountdown(0);
    }
  }

  // Format countdown to MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 80) return "Medium";
    return "Strong";
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      {redirectIfNoEmail()}
      <Button className="absolute left-4 top-4 md:left-8 md:top-8" asChild>
        <Link to="/forgot-password">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col space-y-2 text-center mb-6">
          <div className="flex justify-center mb-2">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the OTP sent to <strong>{email}</strong> and create a new
            secure password
          </p>
        </div>

        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your OTP is valid for 5 minutes. Make sure to create a strong
            password with at least 8 characters.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-12 w-12 text-lg font-semibold"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
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
                        placeholder="Create a strong password"
                        {...field}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
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
                  {watchedPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Password strength:</span>
                        <span
                          className={`font-medium ${
                            passwordStrength < 40
                              ? "text-red-600"
                              : passwordStrength < 80
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <Progress
                        value={passwordStrength}
                        className={`h-2 ${getPasswordStrengthColor()}`}
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        {...field}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isSubmitting}
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-sm underline underline-offset-4 hover:text-primary"
              onClick={handleResendOTP}
              disabled={isResendDisabled || isSubmitting}
            >
              {isResendDisabled
                ? `Resend in ${formatCountdown(countdown)}`
                : "Resend OTP"}
            </Button>
          </p>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center space-y-1">
          <p>Password requirements:</p>
          <ul className="text-left space-y-1 max-w-xs mx-auto">
            <li>• At least 8 characters long</li>
            <li>• Contains uppercase and lowercase letters</li>
            <li>• Contains at least one number</li>
            <li>• Contains at least one special character</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
