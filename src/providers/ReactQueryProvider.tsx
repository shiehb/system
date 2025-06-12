import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable automatic refetching on window focus
      staleTime: 1000 * 60 * 5, // 5 minutes before data becomes stale
      retry: 1, // Retry failed queries once
    },
  },
});

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
