import BaseAPI from '@/lib/api'

class AuthAPI extends BaseAPI {
  _url = "/chat";

  async createNewChat(body) {
    return this.post(`${this._url}/new`,  body);
  }

}

const authAPI = new AuthAPI();
export default authAPI;
