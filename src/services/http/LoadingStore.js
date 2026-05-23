// services/http/loadingStore.js
class LoadingStore {
  constructor() {
    this.count = 0;
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    const isLoading = this.count > 0;
    this.listeners.forEach(fn => fn(isLoading));
  }

  start() {
    this.count++;
    this.notify();
  }

  stop() {
    if (this.count > 0) this.count--;
    this.notify();
  }
}

export const loadingStore = new LoadingStore();
