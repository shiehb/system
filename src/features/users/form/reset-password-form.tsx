import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { ShieldCheck, Info } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  adminPassword: z.string().min(1, "Your admin password is required"),
});

type ResetPasswordFormValues = z.infer<typeof formSchema>;

interface ResetPasswordProps {
  email: string;
  userName?: string;
  children?: React.ReactNode;
}

export function ResetPassword({ email, userName }: ResetPasswordProps) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      adminPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
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
        });
        form.reset();
        setOpen(false);
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Failed to reset password", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-blue-500 hover:text-blue-600">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Reset Password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <Alert className="text-center">
              <Info className="h-4 w-4 mb-2" />
              <AlertTitle>Reset Password</AlertTitle>
              <AlertDescription>
                Password will be reset to system default
              </AlertDescription>
            </Alert>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        disabled={!!email}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Password Reset</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset {userName ? `${userName}'s` : "the user's"}{" "}
              password to the system default. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? "Processing..." : "Confirm Reset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
