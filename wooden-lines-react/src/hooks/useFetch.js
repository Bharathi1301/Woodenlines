import { useCallback, useEffect, useState } from 'react';
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null), [meta, setMeta] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState(null);
  const run = useCallback(async () => { setLoading(true); setError(null); try { const res = await fetcher(); setData(res.data); setMeta(res.meta ?? null); } catch (e) { setError(e.message || 'Something went wrong'); } finally { setLoading(false); } /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, deps);
  useEffect(() => { run(); }, [run]);
  return { data, meta, loading, error, refetch: run };
}
