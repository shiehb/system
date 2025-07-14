import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, ArrowLeft } from "lucide-react";
import {
  fetchNatureOfBusinessOptions,
  createNatureOfBusiness,
  updateNatureOfBusiness,
  type NatureOfBusiness,
} from "@/lib/establishmentApi";

export default function NatureOfBusinessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [businessTypes, setBusinessTypes] = useState<NatureOfBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editData, setEditData] = useState<NatureOfBusiness | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get the previous route from location state or default to '/establishments'
  const previousRoute = location.state?.from || "/establishments";

  // Fetch business types on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNatureOfBusinessOptions();
        setBusinessTypes(data);
      } catch (error) {
        toast.error(
          (error as { message: string }).message ||
            "Failed to fetch business types"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      const newBusiness = await createNatureOfBusiness(formData);
      setBusinessTypes([...businessTypes, newBusiness]);
      toast.success("Business type created successfully");
      setFormData({ name: "", description: "" });
    } catch (error) {
      toast.error(
        (error as { message: string }).message ||
          "Failed to create business type"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;

    try {
      setIsUpdating(true);
      const updatedBusiness = await updateNatureOfBusiness(
        editData.id,
        editData
      );
      setBusinessTypes(
        businessTypes.map((item) =>
          item.id === updatedBusiness.id ? updatedBusiness : item
        )
      );
      toast.success("Business type updated successfully");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        (error as { message: string }).message ||
          "Failed to update business type"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = (item: NatureOfBusiness) => {
    setEditData(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 min-h-[calc(100vh-60px)] flex flex-col">
      {/* Header with Back Button and Title */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Create Form Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate(previousRoute)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
              <CardTitle className="text-lg">Add New Business Type</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={isCreating}
                    placeholder="Enter business type name"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Description
                  </label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    disabled={isCreating}
                    placeholder="Enter description (optional)"
                  />
                </div>
                <Button type="submit" disabled={isCreating} className="w-full">
                  {isCreating ? "Creating..." : "Create Business Type"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Table Column */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Business Types List</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : businessTypes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 h-full flex items-center justify-center">
                  No business types found. Create one to get started.
                </div>
              ) : (
                <div className="rounded-md border h-full flex flex-col">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[40%]">Name</TableHead>
                        <TableHead className="w-[40%]">Description</TableHead>
                        <TableHead className="text-right w-[20%]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {businessTypes.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {item.description || "-"}
                          </TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(item)}
                              className="h-8 px-2"
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Business Type</DialogTitle>
          </DialogHeader>
          {editData && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="edit-name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="edit-name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  required
                  disabled={isUpdating}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="edit-description"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Description
                </label>
                <Input
                  id="edit-description"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  disabled={isUpdating}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
