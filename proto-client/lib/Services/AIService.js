import BaseAPI from "@/lib/api";

class AiService extends BaseAPI {
  _url = "/chat";

  async generate(session_id, message, onToken) {
    await this.stream(`${this._url}/${session_id}/message`, message, onToken);
  }
}

const aiService = new AiService();
export default aiService;
