import BaseAPI from '@/lib/api'

class AuthAPI extends BaseAPI {
  _url = "/users";

  async login(email, password) {
    return this.post(`${this._url}/login`, { email, password });
  }

  async signup(name, email, password) {
    return this.post(`${this._url}/signup`, { name, email, password });
  }
}

const authAPI = new AuthAPI();
export default authAPI;
