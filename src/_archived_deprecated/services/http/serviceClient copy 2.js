import axiosInstance from "../../services/http/axiosConfig";
import fetchClient from "../../services/http/fetchConfig";
import { loadingStore } from "../../services/http/LoadingStore";

// 🔥 Track in-flight requests (auto-cancel)
const pendingRequests = new Map();

// ⏳ Debounce timers
const debounceTimers = new Map();

// 🟣 Queue latest request per key
const latestQueue = new Map();

class HttpService {
  constructor({ client = "axios", baseURL } = {}) {
    this.client = client;
    this.baseURL = baseURL || import.meta.env.VITE_API_URL;
  }

  get activeClient() {
    return this.client === "axios" ? axiosInstance : fetchClient;
  }

  resolveBaseURL(url) {
    return url || this.baseURL || import.meta.env.VITE_API_URL;
  }

  // 🔥 Cancel ALL running API requests
cancelAll() {
  for (const [, controller] of pendingRequests) {
    controller.abort?.();
    controller.cancel?.();
  }

  pendingRequests.clear();
  loadingStore.stop(); // force stop loader
}


  /**
   * Core executor method
   */
  async execute(
    method,
    url,
    {
      payload,
      params,
      headers,
      onSuccess,
      onError,
      baseURL,
      showLoader = true,

      // 🔁 default cancel overlapping
      cancelPrevious = true,

      // ⏳ debounce mode
      debounceMode = false,
      debounceDelay = 400,

      // 🟣 latest-only queue mode
      queueMode = false,
      queueKey,

      requestKey,
      ...rest
    } = {}
  ) {
    const finalBaseURL = this.resolveBaseURL(baseURL);

    // 🔑 Request identity key
    const key = requestKey || `${method}:${finalBaseURL}${url}`;

    // -------------------------------------------------
    // ⏳ MODE-1: DEBOUNCE (wait, only last call runs)
    // -------------------------------------------------
    if (debounceMode) {
      if (debounceTimers.has(key)) {
        clearTimeout(debounceTimers.get(key));
      }

      return new Promise((resolve, reject) => {
        const t = setTimeout(async () => {
          debounceTimers.delete(key);
          try {
            const result = await this.execute(method, url, {
              payload,
              params,
              headers,
              onSuccess,
              onError,
              baseURL,
              showLoader,
              cancelPrevious,
              requestKey,
              ...rest,
              debounceMode: false // avoid loop
            });
            resolve(result);
          } catch (e) {
            reject(e);
          }
        }, debounceDelay);

        debounceTimers.set(key, t);
      });
    }

    // -------------------------------------------------
    // 🟣 MODE-2: QUEUE LATEST (always keep latest)
    // -------------------------------------------------
    if (queueMode) {
      const qKey = queueKey || key;

      // cancel previous queued request
      if (latestQueue.has(qKey)) {
        const prev = latestQueue.get(qKey);
        prev.abort?.();
        prev.cancel?.();
      }

      const controller = new AbortController();
      rest.signal = controller.signal;

      latestQueue.set(qKey, controller);
    }

    // -------------------------------------------------
    // 🔁 DEFAULT: cancel previous overlapping request
    // -------------------------------------------------
    if (cancelPrevious && pendingRequests.has(key)) {
      const prev = pendingRequests.get(key);
      prev.abort?.();
      prev.cancel?.();
    }

    // Create controller
    const controller = new AbortController();
    rest.signal = controller.signal;

    // Save cancel handles
    pendingRequests.set(key, controller);

    try {
      if (showLoader) loadingStore.start();

      const res =
        method === "get" || method === "delete"
          ? await this.activeClient[method](url, {
              params,
              headers,
              baseURL: finalBaseURL,
              ...rest
            })
          : await this.activeClient[method](url, payload, {
              headers,
              baseURL: finalBaseURL,
              ...rest
            });

      onSuccess?.(res.data);
      return res.data;
    } catch (err) {
      // cancelled request → do not error
      if (
        err?.name === "AbortError" ||
        err?.code === "ERR_CANCELED" ||
        err?.message === "Request cancelled"
      ) {
        console.warn("Request cancelled:", key);
        return;
      }

      console.error("HTTP Error:", err);

      onError
        ? onError(err)
        : alert(err?.data?.message || err?.message || "Something went wrong");

      throw err;
    } finally {
      pendingRequests.delete(key);
      if (showLoader) loadingStore.stop();
    }
  }

  // ==== Public wrappers ====
  get(url, o = {}) { return this.execute("get", url, o); }
  post(url, d, o = {}) { return this.execute("post", url, { ...o, payload: d }); }
  put(url, d, o = {}) { return this.execute("put", url, { ...o, payload: d }); }
  patch(url, d, o = {}) { return this.execute("patch", url, { ...o, payload: d }); }
  delete(url, o = {}) { return this.execute("delete", url, o); }

  // 📥 File download
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
