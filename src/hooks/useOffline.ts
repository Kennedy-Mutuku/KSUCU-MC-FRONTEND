import { useState, useEffect, useCallback } from 'react';

interface OfflineState {
  isOnline: boolean;
  wasOffline: boolean;
  retryConnection: () => Promise<boolean>;
}

export const useOffline = (): OfflineState => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  const updateOnlineStatus = useCallback(() => {
    const online = navigator.onLine;
    
    if (!online && isOnline) {
      // Going offline
      setWasOffline(true);
    } else if (online && !isOnline) {
      // Coming back online
      console.log('Connection restored');
    }
    
    setIsOnline(online);
  }, [isOnline]);

  const retryConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Test connection with a small request
      const response = await fetch('/', {
        method: 'HEAD',
        cache: 'no-cache',
        timeout: 5000
      } as RequestInit);
      
      if (response.ok) {
        setIsOnline(true);
        setWasOffline(false);
        return true;
      }
      return false;
    } catch (error) {
      console.log('Connection test failed:', error);
      setIsOnline(false);
      return false;
    }
  }, []);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Cleanup
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [updateOnlineStatus]);

  // Auto-retry connection when offline
  useEffect(() => {
    if (!isOnline) {
      const interval = setInterval(async () => {
        await retryConnection();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isOnline, retryConnection]);

  return {
    isOnline,
    wasOffline,
    retryConnection
  };
};

// Hook for caching data locally
export const useOfflineCache = () => {
  const cacheData = useCallback(async (key: string, data: any): Promise<void> => {
    try {
      localStorage.setItem(`offline_cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }, []);

  const getCachedData = useCallback(<T>(key: string): T | null => {
    try {
      const cached = localStorage.getItem(`offline_cache_${key}`);
      if (!cached) return null;

      const parsedCache = JSON.parse(cached);
      
      // Check if data has expired
      if (Date.now() > parsedCache.expires) {
        localStorage.removeItem(`offline_cache_${key}`);
        return null;
      }

      return parsedCache.data as T;
    } catch (error) {
      console.error('Failed to retrieve cached data:', error);
      return null;
    }
  }, []);

  const clearCache = useCallback((key?: string): void => {
    if (key) {
      localStorage.removeItem(`offline_cache_${key}`);
    } else {
      // Clear all offline cache
      const keys = Object.keys(localStorage).filter(k => k.startsWith('offline_cache_'));
      keys.forEach(k => localStorage.removeItem(k));
    }
  }, []);

  return {
    cacheData,
    getCachedData,
    clearCache
  };
};