import { useState, useEffect, useCallback } from 'react';

interface RealTimeDataOptions {
  interval?: number;
  initialValue?: any;
  fetchData: () => Promise<any>;
}

export function useRealTimeData<T>({ 
  interval = 30000, // 30 seconds default
  initialValue = null,
  fetchData 
}: RealTimeDataOptions) {
  const [data, setData] = useState<T | null>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAndUpdateData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    // Initial fetch
    fetchAndUpdateData();

    // Set up interval for real-time updates
    const intervalId = setInterval(fetchAndUpdateData, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchAndUpdateData, interval]);

  const manualRefresh = useCallback(() => {
    fetchAndUpdateData();
  }, [fetchAndUpdateData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    manualRefresh,
  };
}
