import { useState, useEffect, useCallback } from "react";

function usePagination<T>({
  query,
  page,
  pageSize,
}: {
  query: any;
  page: number;
  pageSize: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<T[]>([]);

  const fetchData = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch paginated data
      const { data: pageData, error: dataError } = await query.range(
        (page - 1) * pageSize,
        page * pageSize - 1
      );

      if (dataError) throw dataError;
      setData(pageData || []);
      setCount(pageData.length);
    } catch (err) {
      if (err instanceof Error) setError(err);
      else setError(new Error("An error occurred while fetching data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    page,
    loading,
    error,
    count,
    data,
  };
}

export default usePagination;
