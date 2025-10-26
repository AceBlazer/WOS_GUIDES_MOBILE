import { QueryClient } from '@tanstack/react-query';
import type { Persister, PersistedClient } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: Infinity, // Keep data fresh forever (until manually invalidated)
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep cache for a week
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // Don't auto-refetch, we'll handle manually
      networkMode: 'offlineFirst', // Use cache when offline
    },
    mutations: {
      retry: 1,
      networkMode: 'online', // Only allow mutations when online
    },
  },
});

// Create custom AsyncStorage persister
export const persister: Persister = {
  persistClient: async (client: PersistedClient) => {
    try {
      await AsyncStorage.setItem('WOS_GUIDES_CACHE', JSON.stringify(client));
    } catch (error) {
      console.error('Failed to persist cache:', error);
    }
  },
  restoreClient: async () => {
    try {
      const cachedData = await AsyncStorage.getItem('WOS_GUIDES_CACHE');
      return cachedData ? JSON.parse(cachedData) : undefined;
    } catch (error) {
      console.error('Failed to restore cache:', error);
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      await AsyncStorage.removeItem('WOS_GUIDES_CACHE');
    } catch (error) {
      console.error('Failed to remove cache:', error);
    }
  },
};

// Listen for network status changes
NetInfo.addEventListener(state => {
  const isOnline = state.isConnected && state.isInternetReachable;

  if (isOnline) {
    // When back online, invalidate all queries to fetch fresh data
    queryClient.invalidateQueries();
  }
});
