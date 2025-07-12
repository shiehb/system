"use client";

import type React from "react";

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
import { changeUserStatus } from "@/lib/api";
import { Ban, CheckCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ChangeStatusProps {
  userId: number;
  currentStatus: "active" | "inactive";
  userName: string;
  onStatusChanged: () => void;
  children?: React.ReactNode;
}

export function ChangeStatus({
  userId,
  currentStatus,
  userName,
  onStatusChanged,
}: ChangeStatusProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const newStatus = currentStatus === "active" ? "inactive" : "active";
  const actionText = currentStatus === "active" ? "Deactivate" : "Activate";
  const statusMessage =
    currentStatus === "active"
      ? "They will no longer be able to access the system."
      : "They will regain access to the system.";

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 100);
    return interval;
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const progressInterval = simulateProgress();

      const response = await changeUserStatus(userId, newStatus);

      clearInterval(progressInterval);
      setProgress(100);

      if (response.success) {
        toast.success(`User ${actionText.toLowerCase()}d successfully`, {
          description: `${userName} has been ${actionText.toLowerCase()}d`,
          duration: 4000,
        });

        setTimeout(() => {
          onStatusChanged();
        }, 500);
      } else {
        throw new Error(response.message || "Failed to change status");
      }
    } catch (error) {
      setProgress(0);
      toast.error(`Failed to ${actionText.toLowerCase()} user`, {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div
        className="flex items-center w-full cursor-pointer hover:bg-muted/50 transition-colors rounded-sm p-1"
        onClick={() => setOpen(true)}
      >
        {currentStatus === "active" ? (
          <Ban className="mr-2 h-4 w-4 text-destructive" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        )}
        <span
          className={
            currentStatus === "active" ? "text-destructive" : "text-green-500"
          }
        >
          {actionText} User
        </span>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {currentStatus === "active" ? (
                <Ban className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              Confirm Status Change
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to {actionText.toLowerCase()}{" "}
                <strong>{userName}</strong>?
              </p>
              <p className="text-sm text-muted-foreground">{statusMessage}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {loading && (
            <div className="space-y-2 px-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {actionText === "Activate" ? "Activating" : "Deactivating"}{" "}
                  user...
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              className="hover:bg-muted/80 transition-colors"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className={`min-w-[100px] transition-all duration-200 ${
                currentStatus === "active"
                  ? "bg-destructive hover:bg-destructive/80 text-destructive-foreground"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {actionText === "Activate"
                    ? "Activating..."
                    : "Deactivating..."}
                </>
              ) : (
                actionText
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
