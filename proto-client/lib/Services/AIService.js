import BaseAPI from "@/lib/api";

class AiService extends BaseAPI {
  _url = "/chat";

  async generate(message, onToken) {
    await this.stream(`${this._url}/df8e9e6e-2037-428b-b1d3-be0baf513e5f/message`, message, onToken);
  }
}

const aiService = new AiService();
export default aiService;
