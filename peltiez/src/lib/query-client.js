import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60_000,        // 1 min default — avoid redundant refetches
      gcTime: 5 * 60_000,       // 5 min garbage collection
      refetchOnMount: false,    // Use cached data when navigating back
    },
    mutations: {
      retry: 0,
    },
  },
});