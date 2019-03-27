/**
 * Config.
 */
export default class Config {
  /**
   * @description
   * The constructor.
   *
   * @param {number} port - Port on which server runs.
   * @param {string} connectionString - Connection string for MongoDB.
   * @param {string} db - MongoDB DB name.
   * @param {string} cookieKey - Secret ket for cookies.
   * @param {string} oauthKey - Client key.
   * @param {string} oauthSecret - Client secret.
   * @param {string} oauthRedirectUri - Redirect URI for OAuth.
   * @param {number} refreshTokenWindow - Window when refresh token is active.
   * @param {number} apiLimitDeviationsBrowse - Limit to fetch deviations to browse from API.
   * @param {number} daoLimitDeviationsBrowse - Limit to fetch deviations to browse from DAO.
   * @param {string} environment - Environment, development or production.
   */
  constructor(
    port,
    connectionString,
    db,
    cookieKey,
    oauthKey,
    oauthSecret,
    oauthRedirectUri,
    refreshTokenWindow,
    apiLimitDeviationsBrowse,
    daoLimitDeviationsBrowse,
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
    this.apiLimitDeviationsBrowse = apiLimitDeviationsBrowse;
    this.daoLimitDeviationsBrowse = daoLimitDeviationsBrowse;
    this.environment = environment;
  }
}
