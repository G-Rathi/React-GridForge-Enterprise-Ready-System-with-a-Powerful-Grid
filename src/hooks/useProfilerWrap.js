import { useCallback, useMemo } from 'react';
import { profiler } from '../utils/profiler';

/**
 * A hook that wraps component rendering with performance profiling.
 * Helps track render times and component optimization opportunities.
 * 
 * @param {string} componentName - Name of the component to profile
 * @param {Object} options - Profiling options
 * @returns {Object} - Profiling methods and data
 */
export function useProfilerWrap(componentName, options = {}) {
  const {
    logToConsole = true,
    threshold = 16, // 1 frame at 60fps
    onSlowRender,
  } = options;

  const profilerId = useMemo(() => 
    `${componentName}-${Math.random().toString(36).substr(2, 9)}`,
    [componentName]
  );

  const onRender = useCallback((
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    // Log performance data
    const perfData = {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions: Array.from(interactions),
    };

    if (logToConsole) {
      console.group(`Component Profiler: ${componentName}`);
      console.table(perfData);
      console.groupEnd();
    }

    // Track in our profiler utility
    profiler.mark(profilerId, {
      type: 'render',
      duration: actualDuration,
      timestamp: commitTime,
    });

    // Alert if render is slow
    if (actualDuration > threshold && onSlowRender) {
      onSlowRender({
        componentName,
        duration: actualDuration,
        threshold,
        ...perfData,
      });
    }
  }, [componentName, logToConsole, onSlowRender, profilerId, threshold]);

  const getProfilerStats = useCallback(() => {
    return profiler.getStats(profilerId);
  }, [profilerId]);

  const clearProfilerStats = useCallback(() => {
    profiler.clear(profilerId);
  }, [profilerId]);

  return {
    profilerId,
    onRender,
    getProfilerStats,
    clearProfilerStats,
    ProfilerProps: {
      id: profilerId,
      onRender,
    },
  };
}