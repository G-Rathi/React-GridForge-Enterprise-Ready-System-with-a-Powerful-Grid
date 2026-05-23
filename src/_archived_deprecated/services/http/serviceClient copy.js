import axiosInstance from "../../services/http/axiosConfig";
import fetchClient from "../../services/http/fetchConfig";
import { loadingStore } from "../../services/http/LoadingStore";

// 🔥 Track in-flight requests (for auto-cancel)
const pendingRequests = new Map();

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
      signal,
      onSuccess,
      onError,
      baseURL,
      showLoader = true,
      cancelPrevious = true,   // 🔁 auto-cancel same API by default
      requestKey,              // optional custom key
      ...rest
    } = {}
  ) {
    const finalBaseURL = this.resolveBaseURL(baseURL);

    // 🔑 Create request identity
    const key =
      requestKey || `${method}:${finalBaseURL}${url}`;

    // 🔥 Cancel previous same request
    if (cancelPrevious && pendingRequests.has(key)) {
      const abort = pendingRequests.get(key);
      abort(); // cancel old request
      pendingRequests.delete(key);
    }

    // Create AbortController
    const controller = new AbortController();
    rest.signal = controller.signal;

    // Store cancel fn
    pendingRequests.set(key, () => controller.abort());

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
      // 🟡 Ignore cancelled requests
      if (err.name === "AbortError") {
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
