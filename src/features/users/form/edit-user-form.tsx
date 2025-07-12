"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldAlert,
  Info,
  Loader2,
  CheckCircle2,
  Edit2,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/lib/api";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const USER_LEVELS = [
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
] as const;

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  middle_name: z.string().optional(),
  user_level: z.enum(USER_LEVELS),
});

type UserFormValues = z.infer<typeof userSchema>;

interface EditUserFormProps {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    user_level: (typeof USER_LEVELS)[number];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export function EditUserForm({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: EditUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<UserFormValues | null>(
    null
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      middle_name: user?.middle_name || "",
      user_level: user?.user_level || "eia_monitoring_personnel",
    },
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        middle_name: user.middle_name || "",
        user_level: user.user_level,
      });
      setFormErrors({});
      setSubmitSuccess(false);
      setSubmitProgress(0);
      setShowConfirmDialog(false);
      setPendingFormData(null);
    }
  }, [user, open, form]);

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

  const handleFormSubmit = (values: UserFormValues) => {
    setPendingFormData(values);
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    if (!pendingFormData) return;

    try {
      setLoading(true);
      setFormErrors({});
      setShowConfirmDialog(false);

      const progressInterval = simulateProgress();

      await updateUser(user.id, {
        email: pendingFormData.email,
        first_name: pendingFormData.first_name,
        last_name: pendingFormData.last_name,
        middle_name: pendingFormData.middle_name,
        user_level: pendingFormData.user_level,
      });

      clearInterval(progressInterval);
      setSubmitProgress(100);
      setSubmitSuccess(true);

      toast.success("User updated successfully", {
        description: `${pendingFormData.first_name} ${pendingFormData.last_name}'s information has been updated`,
        duration: 4000,
      });

      setTimeout(() => {
        onUserUpdated();
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      setSubmitProgress(0);

      if (error instanceof Error) {
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
          toast.error("Update failed", {
            description: error.message,
          });
        }
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
      setPendingFormData(null);
    }
  };

  const formatUserLevel = (level: (typeof USER_LEVELS)[number]) => {
    return level
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const hasChanges = () => {
    const currentValues = form.getValues();
    return (
      currentValues.email !== user.email ||
      currentValues.first_name !== user.first_name ||
      currentValues.last_name !== user.last_name ||
      currentValues.middle_name !== (user.middle_name || "") ||
      currentValues.user_level !== user.user_level
    );
  };

  const getChangedFields = () => {
    if (!pendingFormData) return [];
    const changes = [];
    if (pendingFormData.email !== user.email)
      changes.push(`Email: ${user.email} → ${pendingFormData.email}`);
    if (pendingFormData.first_name !== user.first_name)
      changes.push(
        `First Name: ${user.first_name} → ${pendingFormData.first_name}`
      );
    if (pendingFormData.last_name !== user.last_name)
      changes.push(
        `Last Name: ${user.last_name} → ${pendingFormData.last_name}`
      );
    if (pendingFormData.middle_name !== (user.middle_name || ""))
      changes.push(
        `Middle Name: ${user.middle_name || "None"} → ${
          pendingFormData.middle_name || "None"
        }`
      );
    if (pendingFormData.user_level !== user.user_level)
      changes.push(
        `User Level: ${formatUserLevel(user.user_level)} → ${formatUserLevel(
          pendingFormData.user_level
        )}`
      );
    return changes;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Edit2 className="h-6 w-6 text-primary" />
              Edit User
            </DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>

          {submitSuccess && (
            <div className="flex justify-center">
              <Alert className="border-green-200 bg-green-50 max-w-md">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  User information has been successfully updated.
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

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Updating user...
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
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                            disabled={loading}
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
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                            disabled={loading}
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
                            disabled={loading}
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
                            className={cn(
                              "transition-all focus:ring-2 focus:ring-primary/20",
                              form.formState.errors.email &&
                                "border-destructive focus:ring-destructive/20"
                            )}
                            disabled={loading}
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
                          disabled={loading}
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

                <div className="flex justify-center">
                  <Alert className="border-amber-200 bg-amber-50 max-w-md">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">
                      User Level Information
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">
                      <strong>
                        {formatUserLevel(form.watch("user_level"))}
                      </strong>
                      <br />
                      <span className="text-sm">
                        Role: {form.watch("user_level").replace(/_/g, " ")}
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className="hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || submitSuccess || !hasChanges()}
                  className="min-w-[140px] hover:bg-primary/90 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : submitSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Updated!
                    </>
                  ) : (
                    <>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Save Changes
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
              Confirm User Update
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this user's information?
              {pendingFormData && (
                <div className="mt-3 p-3 bg-muted rounded-md space-y-1 text-sm">
                  <div className="font-medium mb-2">Changes to be made:</div>
                  {getChangedFields().map((change, index) => (
                    <div key={index} className="text-xs">
                      {change}
                    </div>
                  ))}
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
              Update User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
