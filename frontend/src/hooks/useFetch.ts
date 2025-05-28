import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseFetchOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions<T> = {}
) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url);
        setData(response.data);
        options.onSuccess?.(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar los datos');
        options.onError?.(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options.onSuccess, options.onError]);

  return { data, loading, error };
}
