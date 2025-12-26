import BaseAPI from "@/lib/api";

class AiService extends BaseAPI {
  _url = "/ai";

  async generate(prompt, onToken) {
    await this.stream(`${this._url}/generate`, prompt, onToken);
  }
}

const aiService = new AiService();
export default aiService;
