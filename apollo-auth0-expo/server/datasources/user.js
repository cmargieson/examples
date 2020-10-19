const { RESTDataSource } = require("apollo-datasource-rest");

const AUTH0_DOMAIN = "2g9cipk5.au.auth0.com";

class UserAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://${AUTH0_DOMAIN}/`;
  }

  willSendRequest(request) {
    request.headers.set("Authorization", this.context.authorization);
  }

  async retrieveUser() {
    if (this.context.authorization) {
      try {
        const user = await this.get("userinfo");
        return user;
      } catch (e) {
        // Ignore Error: 401: Unauthorized
      }
    }
  }
}

module.exports = UserAPI;
