import { useState, useEffect } from "react";

export function useQuery<T>(queryFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    queryFn()
      .then(res => {
        if (active) {
          setData(res);
          setError(null);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, deps);

  return { data, loading, error, setData };
}
