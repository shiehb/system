import { useQuery } from "@tanstack/react-query"
import { getUsers, getMyProfile } from "@/lib/api"
import type { User } from "@/types"

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: getUsers,
  })
}

export const useMyProfile = () => {
  return useQuery<User, Error>({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  })
}
