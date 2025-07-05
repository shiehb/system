import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  fetchNatureOfBusinessOptions,
} from "@/lib/establishmentApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EstablishmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEstablishment, setEditingEstablishment] =
    useState<Establishment | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [businessTypes, setBusinessTypes] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(true);

  useEffect(() => {
    // Check if we're on the add route
    setShowAddForm(location.pathname === "/establishments/add");

    // Clear editing state if not on edit route
    if (!location.pathname.startsWith("/establishments/edit")) {
      setEditingEstablishment(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadingBusinessTypes(true);

        // Load business types
        const types = await fetchNatureOfBusinessOptions();
        setBusinessTypes(types);

        // Load establishments
        const establishmentsData = await fetchEstablishments();
        setEstablishments(establishmentsData);

        // If editing, find the establishment
        if (id && id !== "add") {
          const establishmentToEdit = establishmentsData.find(
            (est) => est.id === parseInt(id)
          );
          if (establishmentToEdit) {
            setEditingEstablishment(establishmentToEdit);
          } else {
            toast.error("Establishment not found");
            navigate("/establishments");
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
        setLoadingBusinessTypes(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleAddEstablishment = async (est: EstablishmentFormData) => {
    setIsSubmitting(true);
    try {
      const newEstablishment = await createEstablishment(est);
      setEstablishments((prev) => [...prev, newEstablishment]);
      toast.success("Establishment created successfully");
      navigate("/establishments");
    } catch (error) {
      console.error("Failed to add establishment:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to create establishment");
      } else {
        toast.error("Failed to create establishment");
      }
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
      navigate("/establishments");
    } catch (error) {
      console.error("Failed to update establishment:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update establishment");
      } else {
        toast.error("Failed to update establishment");
      }
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
    navigate(`/establishments/edit/${establishment.id}`);
  };

  const handleShowAddForm = () => {
    navigate("/establishments/add");
  };

  const handleCancelAdd = () => {
    navigate("/establishments");
  };

  const handleCancelEdit = () => {
    setEditingEstablishment(null);
    navigate("/establishments");
  };

  const handleToggleMapPreview = (
    show: boolean,
    coordinates?: { lat: string; lng: string; name?: string }
  ) => {
    console.log("Map preview:", show, coordinates);
  };

  if (loading || loadingBusinessTypes) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 bg-muted min-h-[calc(100vh - 64px)]">
      <div className="w-full">
        <div className="w-full">
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
                year_established: editingEstablishment.year_established || "",
                nature_of_business_id:
                  editingEstablishment.nature_of_business?.id ?? 0,
              }}
              businessTypes={businessTypes}
              onUpdate={handleUpdateEstablishment}
              onCancel={handleCancelEdit}
              isSubmitting={isSubmitting}
              onToggleMapPreview={handleToggleMapPreview}
            />
          ) : showAddForm ? (
            <AddEstablishment
              businessTypes={businessTypes}
              onAdd={handleAddEstablishment}
              isSubmitting={isSubmitting}
              onToggleMapPreview={handleToggleMapPreview}
              onCancel={handleCancelAdd}
            />
          ) : (
            <EstablishmentsList
              establishments={establishments}
              onDelete={handleDeleteEstablishment}
              onEdit={handleEdit}
              onShowAddForm={handleShowAddForm}
            />
          )}
        </div>
      </div>
    </div>
  );
}
