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
   * @param {number} refreshTokenWindow - Window when refresh token is active.
   */
  constructor(
    key,
    secret,
    redirectUri,
    refreshTokenWindow,
  ) {
    this.key = key;
    this.secret = secret;
    this.redirectUri = redirectUri;
    this.refreshTokenWindow = refreshTokenWindow;
  }
}
