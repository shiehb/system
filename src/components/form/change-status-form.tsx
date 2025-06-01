import { useState } from "react";
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
import { toast } from "sonner";
import { changeUserStatus } from "@/endpoints/api";
import { Ban, CheckCircle } from "lucide-react";

interface ChangeStatusProps {
  userId: number;
  currentStatus: string;
  userName: string;
  onStatusChanged: () => void;
  children?: React.ReactNode;
}

export function ChangeStatus({ 
  userId, 
  currentStatus, 
  userName,
  onStatusChanged 
}: ChangeStatusProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  const actionText = currentStatus === 'active' ? 'Deactivate' : 'Activate';

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await changeUserStatus(userId, newStatus);
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      onStatusChanged();
    } catch (error) {
      toast.error("Failed to change status", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div 
        className="cursor-pointer flex items-center w-full"
        onClick={() => setOpen(true)}
      >
        {currentStatus === 'active' ? (
          <Ban className="mr-2 h-4 w-4 text-destructive" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        )}
        <span className={currentStatus === 'active' ? "text-destructive" : "text-green-500"}>
          {actionText}
        </span>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionText.toLowerCase()} {userName}?
              {currentStatus === 'active' 
                ? " They will no longer be able to access the system." 
                : " They will regain access to the system."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className={currentStatus === 'active' 
                ? "bg-destructive hover:bg-destructive/90" 
                : "bg-green-600 hover:bg-green-700"}
            >
              {loading ? "Processing..." : `Confirm ${actionText}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}