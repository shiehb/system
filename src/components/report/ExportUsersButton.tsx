import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { prepareUserData, exportToCsv } from "@/utils/exportUtils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ExportUsersButtonProps {
  selectedUserIds: number[];
  users: any[];
}

const ExportUsersButton = ({
  selectedUserIds,
  users,
}: ExportUsersButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    const selectedUsers = users.filter((user) =>
      selectedUserIds.includes(user.id)
    );
    const formattedData = prepareUserData(selectedUsers);
    exportToCsv(
      formattedData,
      `users_${new Date().toISOString().slice(0, 10)}`
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={selectedUserIds.length === 0}
          className="cursor-pointer bg-background text-black border-1 border-foreground hover:bg-muted hover:text-black 
                    transition duration-150 ease-in hover:scale-95"
          aria-label="Export selected users"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Export</DialogTitle>
          <DialogDescription>
            You are about to export {selectedUserIds.length} user(s).
            <br />
            This will generate a CSV file with the selected user data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-600"
          >
            Confirm Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportUsersButton;
