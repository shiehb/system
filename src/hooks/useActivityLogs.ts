import { useQuery } from "@tanstack/react-query"
import { getActivityLogs } from "@/lib/api"
import type { ActivityLog } from "@/types"

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
  total_pages: number
  current_page: number
}

export const useActivityLogs = (params?: {
  action?: string
  user_id?: string
  admin_id?: string
  search?: string
  page?: number
  page_size?: number
}) => {
  return useQuery<PaginatedResponse<ActivityLog>, Error>({
    queryKey: ["activityLogs", params],
    queryFn: () => getActivityLogs(params),
  })
}
