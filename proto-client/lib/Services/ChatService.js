import BaseAPI from '@/lib/api'

class ChatService extends BaseAPI {
  _url = '/chat'

  async createNewChat() {
    return this.post(`${this._url}/new`)
  }

  async startNewChat(content, callbacks) {
    return this.streamWithSession(
      `${this._url}/new`,
      [{ content }],
      callbacks
    )
  }

  async sendMessage(sessionId, content, callbacks) {
    return this.stream(
      `${this._url}/${sessionId}/message`,
      [{ content }],
      callbacks
    )
  }
}

const chatService = new ChatService()
export default chatService
