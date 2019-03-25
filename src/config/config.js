/**
 * Config.
 */
export default class Config {
  constructor(
    port,
    connectionString,
    db,
    cookieKey,
    oauthKey,
    oauthSecret,
    oauthRedirectUri,
    refreshTokenWindow,
    environment,
  ) {
    this.port = port;
    this.connectionString = connectionString;
    this.db = db;
    this.cookieKey = cookieKey;
    this.oauthKey = oauthKey;
    this.oauthSecret = oauthSecret;
    this.oauthRedirectUri = oauthRedirectUri;
    this.refreshTokenWindow = refreshTokenWindow;
    this.environment = environment;
  }
}
