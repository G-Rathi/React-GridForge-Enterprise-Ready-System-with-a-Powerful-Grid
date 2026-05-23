import { useCallback, useState, useRef } from 'react';
import { useIsMountedSafe } from './useIsMountedSafe';

/**
 * A hook for safely handling async operations in React components.
 * Prevents memory leaks and state updates on unmounted components.
 * 
 * @param {Function} asyncFunction - The async function to execute
 * @param {Object} options - Additional options like automatic error handling
 * @returns {[Function, boolean, Error]} - [execute function, loading state, error state]
 */
export function useSafeAsync(asyncFunction, options = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useIsMountedSafe();
  const abortControllerRef = useRef(null);

  const execute = useCallback(async (...args) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setError(null);

    try {
      setIsLoading(true);
      const result = await asyncFunction(...args, abortControllerRef.current.signal);
      
      if (isMounted.current) {
        setIsLoading(false);
        return result;
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err);
        setIsLoading(false);
        
        if (options.onError) {
          options.onError(err);
        } else {
          console.error('Async operation failed:', err);
        }
      }
      throw err;
    }
  }, [asyncFunction, isMounted, options]);

  // Cleanup function
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    execute,
    isLoading,
    error,
    reset,
  };
}