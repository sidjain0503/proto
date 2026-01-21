import BaseAPI from '@/lib/api'

class AuthAPI extends BaseAPI {
  _url = "/models/message";

  async getAllMessages(body) {
    return this.post(`${this._url}/fetch`,  body);
  }

}

const authAPI = new AuthAPI();
export default authAPI;
