import { useQuery } from "@tanstack/react-query"
import { fetchNatureOfBusinessOptions, fetchNatureOfBusinessById, type NatureOfBusiness } from "@/lib/establishmentApi"

export const useNatureOfBusinessOptions = () => {
  return useQuery<NatureOfBusiness[], Error>({
    queryKey: ["natureOfBusinessOptions"],
    queryFn: fetchNatureOfBusinessOptions,
  })
}

export const useNatureOfBusinessById = (id: number) => {
  return useQuery<NatureOfBusiness, Error>({
    queryKey: ["natureOfBusiness", id],
    queryFn: () => fetchNatureOfBusinessById(id),
    enabled: !!id, // Only run query if id is available
  })
}
