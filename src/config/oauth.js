/**
 * OAuth config.
 */
export default class OAuthConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {string} key - Client key.
   * @param {string} secret - Client secret.
   * @param {string} redirectUri - Redirect URI.
   * @param {number} accessTokenWindow - Window when access token is active.
   * @param {number} refreshTokenWindow - Window when refresh token is active.
   */
  constructor(
    key,
    secret,
    redirectUri,
    accessTokenWindow,
    refreshTokenWindow,
  ) {
    this.key = key;
    this.secret = secret;
    this.redirectUri = redirectUri;
    this.accessTokenWindow = accessTokenWindow;
    this.refreshTokenWindow = refreshTokenWindow;
  }
}
