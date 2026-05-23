import { useEffect, useCallback, useState, useRef } from 'react';

/**
 * A hook for prefetching images to ensure they're cached before displaying.
 * Useful for improving perceived performance in image-heavy applications.
 * 
 * @param {string|string[]} imageUrls - Single URL or array of URLs to prefetch
 * @param {Object} options - Configuration options
 * @returns {Object} - Status of image loading
 */
export function usePrefetchImage(imageUrls, options = {}) {
  const {
    timeout = 10000, // Default timeout of 10 seconds
    onSuccess,
    onError,
    onTimeout,
  } = options;

  const [status, setStatus] = useState({
    isLoading: true,
    isError: false,
    completedUrls: [],
    failedUrls: [],
  });

  const timeoutRef = useRef(null);
  const isMounted = useRef(true);

  const loadImage = useCallback((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      
      img.src = url;
    });
  }, []);

  const updateStatus = useCallback((updates) => {
    if (isMounted.current) {
      setStatus(prev => ({ ...prev, ...updates }));
    }
  }, []);

  useEffect(() => {
    const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
    
    const loadImages = async () => {
      try {
        // Set up timeout
        if (timeout > 0) {
          timeoutRef.current = setTimeout(() => {
            updateStatus({ isLoading: false, isError: true });
            if (onTimeout) onTimeout();
          }, timeout);
        }

        // Load all images in parallel
        const results = await Promise.allSettled(
          urls.map(url => loadImage(url))
        );

        // Process results
        const completed = [];
        const failed = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            completed.push(urls[index]);
          } else {
            failed.push(urls[index]);
          }
        });

        updateStatus({
          isLoading: false,
          isError: failed.length > 0,
          completedUrls: completed,
          failedUrls: failed,
        });

        if (completed.length === urls.length && onSuccess) {
          onSuccess(completed);
        } else if (failed.length > 0 && onError) {
          onError(failed);
        }
      } catch (error) {
        updateStatus({
          isLoading: false,
          isError: true,
        });
        if (onError) onError([]);
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    loadImages();

    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [imageUrls, loadImage, onError, onSuccess, onTimeout, timeout, updateStatus]);

  return status;
}