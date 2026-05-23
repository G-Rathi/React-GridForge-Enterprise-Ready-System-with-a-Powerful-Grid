import axiosInstance from "./axiosConfig";
import fetchClient from "./fetchConfig";
import { loadingStore } from "./LoadingStore";

// Track in-flight requests (for auto-cancel)
// Map<requestKey, { abort: Function, route: string }>
const pendingRequests = new Map();

class HttpService {
  constructor({ client = "axios", baseURL } = {}) {
    this.client = client;
    // Default to VITE_API_URL so dev uses deployed server unless overridden.
    this.baseURL = baseURL || import.meta.env.VITE_API_URL;
  }

  get activeClient() {
    return this.client === "axios" ? axiosInstance : fetchClient;
  }

  resolveBaseURL(url) {
    return url || this.baseURL || import.meta.env.VITE_API_URL;
  }

  async execute(
    method,
    url,
    {
      payload,
      params,
      headers,
      signal,
      onSuccess,
      onError,
      baseURL,
      showLoader = true,
      cancelPrevious = true,   // auto-cancel same API by default
      requestKey,              // optional custom key
      ...rest
    } = {}
  ) {
    const finalBaseURL = this.resolveBaseURL(baseURL);

    // Create request identity
    const key =
      requestKey || `${method}:${finalBaseURL}${url}`;

    // Cancel previous same request
    if (cancelPrevious && pendingRequests.has(key)) {
      const prev = pendingRequests.get(key);
      prev.abort(); // cancel old request
      pendingRequests.delete(key);
    }

    // Create AbortController
    const controller = new AbortController();
    rest.signal = controller.signal;

    // Store cancel fn + route info (route may be injected via options or derived from current route)
    const reqRoute = rest.route || this._currentRoute || null;
    pendingRequests.set(key, { abort: () => controller.abort(), route: reqRoute });

    try {
      if (showLoader) loadingStore.start(); // loader ON

      const res =
        method === "get" || method === "delete"
          ? await this.activeClient[method](url, {
              params,
              headers,
              signal,
              baseURL: finalBaseURL,
              ...rest
            })
          : await this.activeClient[method](url, payload, {
              headers,
              signal,
              baseURL: finalBaseURL,
              ...rest
            });

      onSuccess?.(res.data);
      return res.data;
    } catch (err) {
      // Ignore cancelled requests (fetch AbortError or axios cancellation)
      const isFetchAbort = err?.name === 'AbortError';
      const isAxiosCancel = err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError' || err?.message === 'canceled';

      if (isFetchAbort || isAxiosCancel) {
        console.warn('Request cancelled:', key);
        return;
      }

      console.error('HTTP Error:', err);

      onError
        ? onError(err)
        : alert(err?.data?.message || err?.message || 'Something went wrong');

      throw err;
    } finally {
      pendingRequests.delete(key);
      if (showLoader) loadingStore.stop(); // loader OFF
    }
  }

  // ==== Public wrappers ====
  get(url, o = {}) {
    return this.execute("get", url, o);
  }

  post(url, d, o = {}) {
    return this.execute("post", url, { ...o, payload: d });
  }

  put(url, d, o = {}) {
    return this.execute("put", url, { ...o, payload: d });
  }

  patch(url, d, o = {}) {
    return this.execute("patch", url, { ...o, payload: d });
  }
  

  delete(url, o = {}) {
    return this.execute("delete", url, o);
  }

  // Cancel all pending requests (used on route change)
  cancelAll() {
    try {
      pendingRequests.forEach(({ abort }) => {
        try {
          abort();
        } catch (e) {
          // ignore abort errors
        }
      });
    } finally {
      pendingRequests.clear();
    }
  }

  // Set current route so new requests can be associated with it
  setCurrentRoute(route) {
    this._currentRoute = route;
  }

  // Cancel only requests that belong to a specific route (useful to cancel previous-route requests)
  cancelRequestsForRoute(route) {
    if (!route) return;
    pendingRequests.forEach((val, key) => {
      if (val?.route === route) {
        try {
          val.abort();
        } catch (e) {}
        pendingRequests.delete(key);
      }
    });
  }

  // File download
  download(url, payload, options = {}) {
    return this.execute("post", url, {
      ...options,
      payload,
      responseType: "blob",
      onSuccess: (blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = options?.fileName || "download";
        link.click();
      }
    });
  }
}

export const serviceClient = new HttpService();
export default serviceClient;
