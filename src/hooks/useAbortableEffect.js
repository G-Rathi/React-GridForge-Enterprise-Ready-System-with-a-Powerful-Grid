import { useEffect, useCallback } from 'react';

export function useAbortableEffect(effect, deps = []) {
  const abortableEffect = useCallback(effect, deps);

  useEffect(() => {
    const abortController = new AbortController();
    
    abortableEffect(abortController.signal);
    
    return () => {
      abortController.abort();
    };
  }, [abortableEffect]);
}