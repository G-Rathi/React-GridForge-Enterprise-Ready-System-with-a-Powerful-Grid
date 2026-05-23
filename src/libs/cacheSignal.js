// Cache invalidation signal
export class CacheSignal {
  constructor() {
    this.listeners = new Set();
  }

  invalidate() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const createCacheSignal = () => new CacheSignal();