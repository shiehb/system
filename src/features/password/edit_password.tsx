"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfile, logout } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, AlertCircle, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingWave } from "@/components/ui/loading-wave";
import { Progress } from "@/components/ui/progress"; // Import Progress component

// Function to determine password strength
const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

  if (strength <= 2)
    return { value: strength * 20, label: "Weak", color: "bg-red-500" };
  if (strength === 3)
    return { value: strength * 20, label: "Medium", color: "bg-yellow-500" };
  if (strength >= 4)
    return { value: strength * 20, label: "Strong", color: "bg-green-500" };
  return { value: 0, label: "", color: "bg-gray-200" };
};

const passwordFormSchema = z
  .object({
    current_password: z.string().optional(),
    new_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/\d/, { message: "Password must contain at least one number." })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character.",
      })
      .optional()
      .or(z.literal("")),
    confirm_password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.new_password) {
      if (!data.current_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Current password is required when changing password",
          path: ["current_password"],
        });
      }
      if (data.new_password !== data.confirm_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match",
          path: ["confirm_password"],
        });
      }
    }
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function ChangePassword() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    value: 0,
    label: "",
    color: "bg-gray-200",
  });

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const newPasswordValue = form.watch("new_password");

  useEffect(() => {
    if (newPasswordValue) {
      setPasswordStrength(getPasswordStrength(newPasswordValue));
    } else {
      setPasswordStrength({ value: 0, label: "", color: "bg-gray-200" });
    }
  }, [newPasswordValue]);

  const handlePasswordSubmit = async (data: PasswordFormValues) => {
    if (!data.new_password) return;

    try {
      setIsLoading(true);
      await updateProfile({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      toast.success("Password updated successfully");

      form.reset({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      await logout();
      toast.success("Please login again with your new password");
      navigate("/login");
    } catch (error: any) {
      form.reset({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      const errorMessage = error.message || "Failed to update password";
      toast.error("Password Update Failed", {
        description: errorMessage,
        duration: 5000,
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center cursor-pointer">
          <Lock className="mr-4 h-4 w-4" />
          Password
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Change Password</DialogTitle>
          <DialogDescription>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2 relative">
                Password must be at least 8 characters long and include at least
                one uppercase letter, one lowercase letter, one number, and one
                special character.
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePasswordSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        aria-label={
                          showCurrentPassword
                            ? "Hide current password"
                            : "Show current password"
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showCurrentPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showNewPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    {newPasswordValue && (
                      <div className="mt-2">
                        <Progress
                          value={passwordStrength.value}
                          className={`h-2 ${passwordStrength.color}`}
                        />
                        <span
                          className={`text-sm font-medium ${passwordStrength.color.replace(
                            "bg-",
                            "text-"
                          )}`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Alert variant="destructive" className="mb-4 items-center ">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  After saving, you'll be automatically logged out for security
                  reasons.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsDialogOpen(false);
                  form.reset(); // Reset form fields when dialog is closed
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid} // Disable if form is not valid
              >
                {isLoading && <LoadingWave message="Please wait..." />}
                Update Password
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
