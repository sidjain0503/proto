import BaseAPI from "@/lib/api";

class AiService extends BaseAPI {
  _url = "/ai";

  async generate(message, onToken) {
    await this.stream(`${this._url}/generate`, message, onToken);
  }
}

const aiService = new AiService();
export default aiService;
