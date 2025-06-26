import { useState, useEffect } from "react";
import {
  AddEstablishment,
  EditEstablishment,
  EstablishmentsList,
} from "@/features/establishments";
import type {
  Establishment,
  EstablishmentFormData,
} from "@/lib/establishmentApi";
import {
  fetchEstablishments,
  createEstablishment,
  updateEstablishment,
  deleteEstablishment,
} from "@/lib/establishmentApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EstablishmentPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEstablishment, setEditingEstablishment] =
    useState<Establishment | null>(null);

  useEffect(() => {
    const loadEstablishments = async () => {
      try {
        const data = await fetchEstablishments();
        setEstablishments(data);
      } catch (error) {
        console.error("Failed to load establishments:", error);
        toast.error("Failed to load establishments");
      } finally {
        setLoading(false);
      }
    };
    loadEstablishments();
  }, []);

  const handleAddEstablishment = async (est: EstablishmentFormData) => {
    setIsSubmitting(true);
    try {
      const newEstablishment = await createEstablishment(est);
      setEstablishments((prev) => [...prev, newEstablishment]);
      toast.success("Establishment created successfully");
    } catch (error) {
      console.error("Failed to add establishment:", error);
      toast.error("Failed to create establishment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEstablishment = async (
    id: number,
    data: EstablishmentFormData
  ) => {
    setIsSubmitting(true);
    try {
      const updatedEstablishment = await updateEstablishment(id, data);
      setEstablishments((prev) =>
        prev.map((est) => (est.id === id ? updatedEstablishment : est))
      );
      toast.success("Establishment updated successfully");
      setEditingEstablishment(null);
    } catch (error) {
      console.error("Failed to update establishment:", error);
      toast.error("Failed to update establishment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEstablishment = async (id: number) => {
    try {
      await deleteEstablishment(id);
      setEstablishments((prev) => prev.filter((est) => est.id !== id));
      toast.success("Establishment deleted successfully");
    } catch (error) {
      console.error("Failed to delete establishment:", error);
      toast.error("Failed to delete establishment");
    }
  };

  const handleEdit = (establishment: Establishment) => {
    setEditingEstablishment(establishment);
  };

  const handleCancelEdit = () => {
    setEditingEstablishment(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-1 bg-muted"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-[350px] lg:sticky lg:top-8 self-start">
          {editingEstablishment ? (
            <EditEstablishment
              id={editingEstablishment.id}
              establishment={{
                name: editingEstablishment.name || "",
                address_line: editingEstablishment.address_line || "",
                barangay: editingEstablishment.barangay || "",
                city: editingEstablishment.city || "",
                province: editingEstablishment.province || "",
                region: editingEstablishment.region || "",
                postal_code: editingEstablishment.postal_code || "",
                latitude: editingEstablishment.latitude || "",
                longitude: editingEstablishment.longitude || "",
                year_established: editingEstablishment.year_established || null,
              }}
              onUpdate={handleUpdateEstablishment}
              onCancel={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          ) : (
            <AddEstablishment
              onAdd={handleAddEstablishment}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
        <div className="flex-1 w-full overflow-x-auto bg-background rounded-lg shadow">
          <EstablishmentsList
            establishments={establishments}
            onDelete={handleDeleteEstablishment}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}
