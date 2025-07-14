"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  UserPlus,
  Info,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import type { UserLevel } from "@/types";
import { Progress } from "@/components/ui/progress";

const USER_LEVELS: UserLevel[] = [
  "division_chief",
  "eia_air_water_section_chief",
  "toxic_hazardous_section_chief",
  "solid_waste_section_chief",
  "eia_monitoring_unit_head",
  "air_quality_unit_head",
  "water_quality_unit_head",
  "eia_monitoring_personnel",
  "air_quality_monitoring_personnel",
  "water_quality_monitoring_personnel",
  "toxic_chemicals_monitoring_personnel",
  "solid_waste_monitoring_personnel",
];

const userSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    middle_name: z.string().optional(),
    password: z.string().optional(),
    cPassword: z.string().optional(),
    user_level: z.enum([
      "division_chief",
      "eia_air_water_section_chief",
      "toxic_hazardous_section_chief",
      "solid_waste_section_chief",
      "eia_monitoring_unit_head",
      "air_quality_unit_head",
      "water_quality_unit_head",
      "eia_monitoring_personnel",
      "air_quality_monitoring_personnel",
      "water_quality_monitoring_personnel",
      "toxic_chemicals_monitoring_personnel",
      "solid_waste_monitoring_personnel",
    ]),
    showPasswordFields: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.showPasswordFields && data.password && data.password.length > 0) {
      if (data.password !== data.cPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["cPassword"],
        });
      }
    }
  });

interface AddUserFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onUserAdded?: () => void;
}

export function AddUserForm({
  className,
  onUserAdded,
  ...props
}: AddUserFormProps) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<z.infer<
    typeof userSchema
  > | null>(null);

  const { register_user } = useAuth();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      password: "",
      cPassword: "",
      user_level: "eia_monitoring_personnel",
      showPasswordFields: false,
    },
  });

  useEffect(() => {
    if (!open) {
      setFormErrors({});
      setSubmitSuccess(false);
      setSubmitProgress(0);
      setShowConfirmDialog(false);
      setPendingFormData(null);
    } else {
      form.reset({
        email: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        password: "",
        cPassword: "",
        user_level: "eia_monitoring_personnel",
        showPasswordFields: false,
      });
    }
  }, [open, form]);

  const simulateProgress = () => {
    setSubmitProgress(0);
    const interval = setInterval(() => {
      setSubmitProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    return interval;
  };

  const handleFormSubmit = (values: z.infer<typeof userSchema>) => {
    setPendingFormData(values);
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    if (!pendingFormData) return;

    const { cPassword, showPasswordFields, ...userData } = pendingFormData;

    try {
      setIsSubmitting(true);
      setFormErrors({});
      setShowConfirmDialog(false);

      const progressInterval = simulateProgress();

      await register_user(
        userData.email,
        userData.first_name,
        userData.last_name,
        userData.middle_name || "",
        showPasswordFields ? userData.password || "" : "",
        userData.user_level
      );

      clearInterval(progressInterval);
      setSubmitProgress(100);
      setSubmitSuccess(true);

      toast.success("User added successfully", {
        description: `${userData.first_name} ${userData.last_name} has been added to the system`,
        duration: 4000,
      });

      setTimeout(() => {
        setOpen(false);
        onUserAdded?.();
      }, 1500);
    } catch (error: any) {
      console.error("Error adding user:", error);
      setSubmitProgress(0);

      if (error.message) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.errors) {
            setFormErrors(errorData.errors);

            Object.keys(errorData.errors).forEach((field) => {
              form.setError(field as any, {
                type: "manual",
                message: errorData.errors[field][0],
              });
            });

            toast.error("Validation failed", {
              description: "Please correct the errors in the form",
            });
            return;
          }
        } catch (e) {
          toast.error("Registration failed", {
            description: error.message,
          });
        }
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
      setPendingFormData(null);
    }
  };

  const showPasswordFields = form.watch("showPasswordFields");
  const userLevel = form.watch("user_level");

  const formatUserLevel = (level: UserLevel) => {
    return level
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "gap-2 hover:bg-primary/90 transition-all duration-200",
              className
            )}
            {...props}
          >
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-primary" />
              Add New User
            </DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>

          {submitSuccess && (
            <div className="flex justify-center">
              <Alert className="border-green-200 bg-green-50 max-w-md">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  User has been successfully added to the system.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {Object.keys(formErrors).length > 0 && (
                <div className="flex justify-center">
                  <Alert variant="destructive" className="max-w-md">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Form Errors</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 space-y-1">
                        {Object.entries(formErrors).map(([field, errors]) =>
                          errors.map((error, index) => (
                            <li key={`${field}-${index}`} className="text-sm">
                              {error}
                            </li>
                          ))
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Creating user...
                    </span>
                    <span className="font-medium">{submitProgress}%</span>
                  </div>
                  <Progress value={submitProgress} className="h-2" />
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          First Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John"
                            required
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Last Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Doe"
                            required
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="middle_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Middle Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Michael"
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="user@example.com"
                            required
                            className={cn(
                              "transition-all focus:ring-2 focus:ring-primary/20",
                              form.formState.errors.email &&
                                "border-destructive focus:ring-destructive/20"
                            )}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="user_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          User Level *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Select user level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {USER_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {formatUserLevel(level)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="showPasswordFields"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/30">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium cursor-pointer">
                            Set custom password
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Check this box if you want to set a custom password
                            for the user
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!showPasswordFields && (
                    <div className="flex justify-center">
                      <Alert className="border-blue-200 bg-blue-50 max-w-md">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">
                          Default Password
                        </AlertTitle>
                        <AlertDescription className="text-blue-700">
                          A secure default password will be automatically
                          generated and sent to the user's email address.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {showPasswordFields && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                                  disabled={isSubmitting}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={() => setShowPassword(!showPassword)}
                                  disabled={isSubmitting}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showCPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                                  disabled={isSubmitting}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={() =>
                                    setShowCPassword(!showCPassword)
                                  }
                                  disabled={isSubmitting}
                                >
                                  {showCPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <Alert className="border-amber-200 bg-amber-50 max-w-md">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">
                      User Level Information
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">
                      <strong>{formatUserLevel(userLevel)}</strong>
                      <br />
                      <span className="text-sm">
                        Role: {userLevel.replace(/_/g, " ")}
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                  className="hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="min-w-[120px] hover:bg-primary/90 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : submitSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Created!
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add User
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm User Creation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create a new user with the following
              details?
              {pendingFormData && (
                <div className="mt-3 p-3 bg-muted rounded-md space-y-1 text-sm">
                  <div>
                    <strong>Name:</strong> {pendingFormData.first_name}{" "}
                    {pendingFormData.middle_name} {pendingFormData.last_name}
                  </div>
                  <div>
                    <strong>Email:</strong> {pendingFormData.email}
                  </div>
                  <div>
                    <strong>User Level:</strong>{" "}
                    {formatUserLevel(pendingFormData.user_level)}
                  </div>
                  <div>
                    <strong>Password:</strong>{" "}
                    {pendingFormData.showPasswordFields
                      ? "Custom password set"
                      : "Auto-generated"}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              Create User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
