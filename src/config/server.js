/**
 * Server config.
 */
export default class ServerConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} configObject - The parsed JSON config.
   */
  constructor(
    configObject,
  ) {
    this.port = configObject.port;
    this.cookieKey = configObject.cookieKey;
    this.staticMaxAge = configObject.staticMaxAge;
  }
}
