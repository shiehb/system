import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EstablishmentList } from "./EstablishmentList";

interface Establishment {
  id: number;
  name: string;
  address: string;
}

interface AssignListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  establishments: Establishment[];
  selected: number[];
  onSave: (selectedIds: number[]) => void;
}

export default function AssignListDialog({
  open,
  onOpenChange,
  establishments,
  selected,
  onSave,
}: AssignListDialogProps) {
  const handleToggle = (id: number, checked: boolean) => {
    const newSelection = checked
      ? [...selected, id]
      : selected.filter((item) => item !== id);
    onSave(newSelection);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Establishments</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto border rounded p-2 bg-muted/30">
          <EstablishmentList
            establishments={establishments}
            selected={selected}
            onToggle={handleToggle}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
