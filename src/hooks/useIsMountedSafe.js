import { useEffect, useRef } from 'react';

export function useIsMountedSafe() {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}