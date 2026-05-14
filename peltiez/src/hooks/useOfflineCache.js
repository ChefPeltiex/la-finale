import { useEffect, useState } from 'react';

const CACHE_PREFIX = 'circul_ai_cache_';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 jours

export default function useOfflineCache(key, fetchFn, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);

  const cacheKey = `${CACHE_PREFIX}${key}`;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch fresh data
        if (navigator.onLine) {
          const freshData = await fetchFn();
          setData(freshData);
          setIsStale(false);
          
          // Cache the data
          const cacheEntry = {
            data: freshData,
            timestamp: Date.now()
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
          setError(null);
        } else {
          // Offline: load from cache
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const { data: cachedData, timestamp } = JSON.parse(cached);
            setData(cachedData);
            setIsStale(Date.now() - timestamp > CACHE_TTL);
            setError(null);
          } else {
            setError('Aucune donnée en cache disponible');
          }
        }
      } catch (err) {
        // Fallback to cache on error
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          setData(cachedData);
          setIsStale(Date.now() - timestamp > CACHE_TTL);
          setError(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, fetchFn, cacheKey]);

  const invalidateCache = () => {
    localStorage.removeItem(cacheKey);
    setData(null);
    setIsStale(false);
  };

  return { data, loading, error, isStale, invalidateCache };
}