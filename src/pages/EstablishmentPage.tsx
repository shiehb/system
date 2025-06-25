import { useState, useEffect } from "react";
import {
  AddEstablishment,
  EstablishmentsList,
} from "@/features/establishments";
import type { Establishment, EstablishmentFormData } from "@/lib/establishmentApi";
import {
  fetchEstablishments,
  createEstablishment,
} from "@/lib/establishmentApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EstablishmentPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleAddEstablishment = async (
    est: EstablishmentFormData
  ) => {
    setIsCreating(true);
    try {
      const newEstablishment = await createEstablishment(est);
      setEstablishments((prev) => [...prev, newEstablishment]);
      toast.success("Establishment created successfully");
    } catch (error) {
      console.error("Failed to add establishment:", error);
      toast.error("Failed to create establishment");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEstablishment = (id: number) => {
    setEstablishments(prev => prev.filter(est => est.id !== id));
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="flex flex-1 bg-muted" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="flex flex-col lg:flex-row gap-4 p-4 w-full">
        <div className="w-full lg:w-[350px] lg:sticky lg:top-8 self-start">
          <AddEstablishment 
            onAdd={handleAddEstablishment} 
            isSubmitting={isCreating}
          />
        </div>
        <div className="flex-1 w-full overflow-x-auto bg-background rounded-lg shadow">
          <EstablishmentsList 
            establishments={establishments} 
            onDelete={handleDeleteEstablishment}
          />
        </div>
      </div>
    </div>
  );
}