import { useEffect, useState } from "react";
import { api } from "@/app/services/api";

interface UseCollectionOptions {
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  enabled?: boolean;
}

export const useCollection = <T,>(collection: string, options: UseCollectionOptions = {}) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options.enabled === false) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await api.fetchCollection(collection, {
          limit: options.limit ?? 200,
          sort: options.sort ?? "_id",
          order: options.order ?? "desc",
        });
        if (active) setData(items || []);
      } catch (err) {
        if (active) setError(err as Error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [collection, options.limit, options.order, options.sort, options.enabled]);

  return { data, loading, error, setData };
};
