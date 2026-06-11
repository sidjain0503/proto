import BaseAPI from '@/lib/api'

class SessionService extends BaseAPI {
  _url = '/sessions'

  async list() {
    const response = await this.get(this._url)
    return response.data || []
  }

  async getMessages(sessionId) {
    const response = await this.get(`${this._url}/${sessionId}/messages`)
    return response.data || []
  }
}

const sessionService = new SessionService()
export default sessionService
