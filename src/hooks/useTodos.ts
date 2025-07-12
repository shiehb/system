import { useQuery } from "@tanstack/react-query"
import { fetchTodos } from "@/lib/api"

interface Todo {
  id: number
  title: string
  completed: boolean
}

export const useTodos = () => {
  return useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  })
}
