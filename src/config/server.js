/**
 * Server config.
 */
export default class ServerConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {number} port - Port on which server runs.
   * @param {string} cookieKey - Secret key for cookies.
   */
  constructor(
    port,
    cookieKey,
  ) {
    this.port = port;
    this.cookieKey = cookieKey;
  }
}
