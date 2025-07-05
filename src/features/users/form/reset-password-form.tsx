import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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
import { adminResetPassword } from "@/lib/api";
import { ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  adminPassword: z
    .string()
    .min(8, "Admin password must be at least 8 characters"),
  // .regex(/[a-z]/, "Must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Must contain at least one number"),
});

type ResetPasswordFormValues = z.infer<typeof formSchema>;

interface ResetPasswordProps {
  email: string;
  userName?: string;
  children?: React.ReactNode;
  onSuccess?: () => void;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | "secondary";
}

export function ResetPassword({
  email,
  userName,
  onSuccess,
  className,
  variant = "ghost",
}: ResetPasswordProps) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      adminPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setError(null);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const values = form.getValues();

      const response = await adminResetPassword(
        values.email,
        values.adminPassword
      );

      if (response.success) {
        toast.success("Password reset successfully", {
          description: response.message || "Password has been reset to default",
          action: {
            label: "Dismiss",
            onClick: () => {},
          },
        });
        form.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error("Failed to reset password", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setError(null);
      form.reset();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={variant}
            className={cn("text-blue-500 hover:text-blue-600", className)}
            aria-label="Reset password"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Reset Password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Reset Password</DialogTitle>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This will reset the password to system default. Proceed with
                caution.
              </AlertDescription>
            </Alert>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium leading-none break-words">
                  {email}
                </h3>
                {userName && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {userName}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="adminPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Admin Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your admin password"
                        autoComplete="current-password"
                        disabled={loading}
                        aria-describedby="adminPasswordHelp"
                      />
                    </FormControl>
                    <p
                      id="adminPasswordHelp"
                      className="text-sm text-muted-foreground mt-1"
                    >
                      For security verification
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !form.formState.isValid}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!loading) setConfirmOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Password Reset
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              You are about to reset the password for{" "}
              <span className="font-semibold">{userName || email}</span>. This
              will:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Set the password to the system default</li>
                <li>Require the user to change it on next login</li>
                <li>Cannot be undone</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90 focus:ring-destructive"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Reset"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
