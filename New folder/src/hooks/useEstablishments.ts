import { useQuery } from "@tanstack/react-query"
import {
  fetchEstablishments,
  fetchArchivedEstablishments,
  fetchEstablishmentById,
  type Establishment,
} from "@/lib/establishmentApi"

export const useEstablishments = () => {
  return useQuery<Establishment[], Error>({
    queryKey: ["establishments", "active"],
    queryFn: fetchEstablishments,
  })
}

export const useArchivedEstablishments = () => {
  return useQuery<Establishment[], Error>({
    queryKey: ["establishments", "archived"],
    queryFn: fetchArchivedEstablishments,
  })
}

export const useEstablishmentById = (id: number) => {
  return useQuery<Establishment, Error>({
    queryKey: ["establishment", id],
    queryFn: () => fetchEstablishmentById(id),
    enabled: !!id, // Only run query if id is available
  })
}
