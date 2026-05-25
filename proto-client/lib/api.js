import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/proto/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class APIInterceptor {
  static async interceptRequest(endpoint, options = {}) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const config = {
      url: endpoint,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    if (options.body && typeof options.body === "object") {
      config.data = options.body;
      delete config.body;
    }

    return config;
  }

  static async interceptResponse(response) {
    return response.data;
  }

  static async interceptError(error) {
    if (
      error.response &&
      error.response.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.clear();
      window.location.href = "/login";
      return {};
    }
    throw error;
  }
}

export class BaseAPI {
  async request(endpoint, options = {}) {
    try {
      const config = await APIInterceptor.interceptRequest(endpoint, options);
      const response = await axiosInstance.request(config);
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

  async _fetchStream(endpoint, body) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const err = await response
        .json()
        .catch(() => ({ error: `Request failed: ${response.status}` }));
      throw new Error(err.error || err.message || "Request failed");
    }

    if (!response.body) throw new Error("No stream available");

    return response;
  }

  async _consumeStream(response, callbacks = {}) {
    const { onToken, onStatus, onComplete, onError } = callbacks;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let completionPayload = null;
    let completed = false;
    let errored = false;

    const dispatch = (event) => {
      if (!event || typeof event !== "object") return;
      switch (event.type) {
        case "token":
          if (typeof event.value === "string") onToken?.(event.value);
          break;
        case "status":
          onStatus?.(event);
          break;
        case "done":
          completionPayload = event;
          completed = true;
          break;
        case "error":
          errored = true;
          onError?.(new Error(event.message || "Stream error"));
          break;
        default:
          break;
      }
    };

    const handleLine = (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      try {
        dispatch(JSON.parse(trimmed));
      } catch {
        onToken?.(trimmed);
      }
    };

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          handleLine(line);
        }
      }
      if (buffer.length > 0) handleLine(buffer);
      if (!errored) onComplete?.(completionPayload || {});
    } catch (error) {
      if (!errored) onError?.(error);
    } finally {
      reader.releaseLock();
    }
  }

  async stream(endpoint, body, callbacks) {
    const normalized =
      typeof callbacks === "function"
        ? { onToken: callbacks }
        : callbacks || {};
    const response = await this._fetchStream(endpoint, body);
    await this._consumeStream(response, normalized);
  }

  async streamWithSession(endpoint, body, callbacks = {}) {
    const { onSessionReady, ...rest } = callbacks;
    const response = await this._fetchStream(endpoint, body);

    const sessionId = response.headers.get("X-Session-Id");
    if (!sessionId) {
      throw new Error("Server did not return a session id");
    }

    onSessionReady?.(sessionId);

    this._consumeStream(response, rest);

    return sessionId;
  }
}

export default BaseAPI;
