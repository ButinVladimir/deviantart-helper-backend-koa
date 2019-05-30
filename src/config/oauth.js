/**
 * OAuth config.
 */
export default class OAuthConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} configObject - The parsed JSON config.
   */
  constructor(
    configObject,
  ) {
    this.key = configObject.key;
    this.secret = configObject.secret;
    this.tokenKey = configObject.tokenKey;
    this.callbackUri = configObject.callbackUri;
    this.redirectUri = configObject.redirectUri;
    this.accessTokenWindow = configObject.accessTokenWindow;
    this.refreshTokenWindow = configObject.refreshTokenWindow;
  }
}
