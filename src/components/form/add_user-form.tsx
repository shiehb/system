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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, UserPlus, Info, ShieldAlert } from "lucide-react";
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

const userSchema = z
  .object({
    id_number: z.string().min(3, "ID Number must be at least 3 characters"),
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    middle_name: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().optional(),
    cPassword: z.string().optional(),
    user_level: z.enum(["admin", "manager", "inspector"]),
    status: z.enum(["active", "inactive"]),
    showPasswordFields: z.boolean(),
  })
  .refine(
    (data) => {
      if (
        data.showPasswordFields &&
        data.password &&
        data.password.length > 0
      ) {
        return data.password === data.cPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["cPassword"],
    }
  );

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

  const { register_user } = useAuth();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id_number: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
      password: "",
      cPassword: "",
      user_level: "inspector",
      status: "active",
      showPasswordFields: false,
    },
  });

  useEffect(() => {
    if (!open) {
      setFormErrors({});
    } else {
      form.reset({
        id_number: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        password: "",
        cPassword: "",
        user_level: "inspector",
        status: "active",
        showPasswordFields: false,
      });
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    const { cPassword, showPasswordFields, ...userData } = values;

    try {
      setFormErrors({});

      await register_user(
        userData.id_number,
        userData.first_name,
        userData.last_name,
        userData.middle_name || "",
        userData.email,
        showPasswordFields ? userData.password || "" : "",
        userData.user_level,
        userData.status,
        showPasswordFields ? cPassword || "" : ""
      );

      toast.success("User added successfully");
      setOpen(false);
      onUserAdded?.(); // Call the callback after success
    } catch (error: any) {
      console.error("Error adding user:", error);

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
    }
  };

  const showPasswordFields = form.watch("showPasswordFields");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={cn("w-full md:w-auto", className)} {...props}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add User</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {Object.keys(formErrors).length > 0 && (
              <Alert variant="destructive" className="col-span-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="id_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456789"
                        required
                        className={
                          form.formState.errors.id_number
                            ? "border-destructive"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        required
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

              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John" required />
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
                      <Input {...field} placeholder="Doe" required />
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
                    <FormLabel>Middle Name (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Michael" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showPasswordFields"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set custom password</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {!showPasswordFields && (
                <Alert className="col-span-2 flex flex-col items-center justify-center text-center">
                  <Info className="h-4 w-4 mb-2" />
                  <AlertTitle>
                    A default password will be automatically generated.
                  </AlertTitle>
                  <AlertDescription>
                    Check the box above if you want to set a custom password.
                  </AlertDescription>
                </Alert>
              )}

              {showPasswordFields && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {showPasswordFields && (
                <FormField
                  control={form.control}
                  name="cPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showCPassword ? "text" : "password"}
                            placeholder="••••••"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowCPassword(!showCPassword)}
                          >
                            {showCPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="user_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="inspector">Inspector</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add User</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
