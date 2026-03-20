import BaseAPI from "@/lib/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/proto/api";

class DocumentService extends BaseAPI {
  _url = "/documents";

  async upload(file, title) {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(`${API_BASE_URL}${this._url}/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(err.error || "Upload failed");
    }

    return response.json();
  }

  async list() {
    return this.get(this._url);
  }

  async getDocument(id) {
    return this.get(`${this._url}/${id}`);
  }

  async deleteDocument(id) {
    return this.delete(`${this._url}/${id}`);
  }

  async reingest(id) {
    return this.post(`${this._url}/${id}/reingest`);
  }
}

const documentService = new DocumentService();
export default documentService;
