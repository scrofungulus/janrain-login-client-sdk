const axios = require('axios');

class BaseClient {
  constructor(url, options = {}) {
    this.axios  = axios.create({
      baseURL: url,
      timeout: options.timeout ? options.timeout : 5000,
    });
  }

  get(endpoint, data = {}) {
    return this.axios.get(endpoint, data);
  }

  post(endpoint, body, data = {}) {
    return this.axios.post(endpoint, body);
  }

  setAccessToken(token) {
    this.options.accessToken = token;
  }
}

module.exports = BaseClient;
