const fetchClient = {
  async get(url, options = {}) {
    return this.request(url, { method: "GET", ...options });
  },

  async post(url, data, options = {}) {
    return this.request(url, { method: "POST", body: JSON.stringify(data), ...options });
  },

  async put(url, data, options = {}) {
    return this.request(url, { method: "PUT", body: JSON.stringify(data), ...options });
  },

  async patch(url, data, options = {}) {
    return this.request(url, { method: "PATCH", body: JSON.stringify(data), ...options });
  },

  async delete(url, options = {}) {
    return this.request(url, { method: "DELETE", ...options });
  },

  async request(url, options) {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const error = new Error(data?.message || "API Error");
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return { data };
  }
};

export default fetchClient;
