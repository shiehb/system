import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ShieldAlert, Info } from "lucide-react";
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

const USER_LEVELS = [
  "administrator",
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
  status: z.enum(["active", "inactive"]),
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
    status: "active" | "inactive";
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

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      middle_name: user?.middle_name || "",
      user_level: user?.user_level || "eia_monitoring_personnel",
      status: user?.status || "active",
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
        status: user.status,
      });
      setFormErrors({});
    }
  }, [user, open, form]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      setLoading(true);
      setFormErrors({});

      await updateUser(user.id, {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        middle_name: values.middle_name,
        user_level: values.user_level,
        status: values.status,
      });

      toast.success("User updated successfully");
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.errors) {
            // Set form-level errors
            setFormErrors(errorData.errors);

            // Set field-level errors
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
    }
  };

  const formatUserLevel = (level: (typeof USER_LEVELS)[number]) => {
    return level
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
          <Separator className="my-2" />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {Object.keys(formErrors).length > 0 && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Form Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5">
                    {Object.entries(formErrors).map(([field, errors]) =>
                      errors.map((error, index) => (
                        <li key={`${field}-${index}`}>{error}</li>
                      ))
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="user@example.com"
                          className={
                            form.formState.errors.email
                              ? "border-destructive"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John" />
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Doe" />
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
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Michael" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>User Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select user level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
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

              <Alert className="col-span-2 flex flex-col items-center justify-center text-center">
                <Info className="h-4 w-4 mb-2" />
                <AlertTitle>User Level Information</AlertTitle>
                <AlertDescription>
                  {formatUserLevel(form.watch("user_level"))}
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-foreground hover:bg-primary/80"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
