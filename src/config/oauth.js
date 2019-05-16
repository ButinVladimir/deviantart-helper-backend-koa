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
   * @param {string} tokenKey - The token encryption key.
   * @param {string} redirectUri - Redirect URI.
   * @param {number} accessTokenWindow - Window when access token is active.
   * @param {number} refreshTokenWindow - Window when refresh token is active.
   */
  constructor(
    key,
    secret,
    tokenKey,
    redirectUri,
    accessTokenWindow,
    refreshTokenWindow,
  ) {
    this.key = key;
    this.secret = secret;
    this.tokenKey = tokenKey;
    this.redirectUri = redirectUri;
    this.accessTokenWindow = accessTokenWindow;
    this.refreshTokenWindow = refreshTokenWindow;
  }
}
