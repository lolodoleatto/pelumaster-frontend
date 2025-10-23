// src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  refetch: () => void; // Para recargar los datos tras una acción (ej. borrar un turno)
}

export const useFetch = <T>(fetcher: () => Promise<T>): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [trigger, setTrigger] = useState(0); 

  const refetch = useCallback(() => {
    setTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true; 

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as AxiosError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetcher, trigger]); 

  return { data, loading, error, refetch };
};