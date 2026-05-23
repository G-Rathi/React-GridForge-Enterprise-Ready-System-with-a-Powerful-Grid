// Cache utilities
export const createCache = (options = {}) => {
  const cache = new Map();
  const { maxAge = 5 * 60 * 1000 } = options; // Default 5 minutes

  return {
    get(key) {
      const item = cache.get(key);
      if (!item) return undefined;
      
      if (Date.now() - item.timestamp > maxAge) {
        cache.delete(key);
        return undefined;
      }
      
      return item.value;
    },

    set(key, value) {
      cache.set(key, {
        value,
        timestamp: Date.now(),
      });
    },

    delete(key) {
      cache.delete(key);
    },

    clear() {
      cache.clear();
    },
  };
};