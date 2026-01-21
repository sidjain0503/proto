import BaseAPI from '@/lib/api'

class AuthAPI extends BaseAPI {

  _url = "/models";

  async createModel(model, data) {
    return this.post(`${this._url}/${model}/create`, data);
  }

  async updateModelById(model, id, data) {
    return this.put(`${this._url}/${model}/${id}`, data);
  }

  async fetchModel(model, body = {}) {
    return this.post(`${this._url}/${model}/fetch`, body);
  }
}


const authAPI = new AuthAPI();
export default authAPI;
