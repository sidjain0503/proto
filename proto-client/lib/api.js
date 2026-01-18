const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/proto/api";

class APIInterceptor {
  static async interceptRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    return { url, config };
  }

  static async interceptResponse(response) {
    let data;
    try {
      // Some requests (like HEAD) might not have JSON responses
      if (
        response.status !== 204 &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        data = await response.json();
      } else if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.clear();
          window.location.href = "/login";
        }
        data = {};
      } else {
        data = {};
      }
    } catch {
      data = {};
    }
    if (!response.ok) {
      throw new Error(data?.message || data?.error || "An error occurred");
    }
    return data;
  }

  static async interceptError(error) {
    throw error;
  }
}

export class BaseAPI {
  async request(endpoint, options = {}) {
    try {
      const { url, config } = await APIInterceptor.interceptRequest(
        endpoint,
        options
      );
      const response = await fetch(url, config);
      return await APIInterceptor.interceptResponse(response);
    } catch (error) {
      return APIInterceptor.interceptError(error);
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "GET",
    });
  }

  async post(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  }

  async put(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  async patch(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  }

  async head(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "HEAD",
    });
  }

  async stream(endpoint, prompt, onToken) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify([...prompt]),
    });

    if (!response.body) throw new Error("No stream");

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        onToken(decoder.decode(value, { stream: true }));
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export default BaseAPI;
