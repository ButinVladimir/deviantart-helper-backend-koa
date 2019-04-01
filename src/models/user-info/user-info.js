import Config from '../../config/config';

/**
 * User info model object.
 */
export default class UserInfoModel {
  /**
   * @description
   * The constructor.
   */
  constructor() {
    this.accessToken = '';
    this.refreshToken = '';
    this.accessTokenExpires = 0;
    this.refreshTokenExpires = 0;
    this.userId = '';
    this.userName = '';
    this.userIcon = '';
    this.userType = '';
  }

  /**
   * @description
   * Adds auth data.
   *
   * @param {Object} grantResponse - Response from grant.
   * @param {Config} config - The config.
   * @returns {UserInfoModel} Self.
   */
  addAuthData(grantResponse, config) {
    this.accessToken = grantResponse.access_token;
    this.refreshToken = grantResponse.refresh_token;
    this.accessTokenExpires = Date.now() + grantResponse.raw.expires_in * 1000;
    this.refreshTokenExpires = Date.now() + config.oauthConfig.refreshTokenWindow;

    return this;
  }

  /**
   * @description
   * Adds 'user/who-am-i' data from DeviantArt API.
   *
   * @param {Object} whoAmIData - DeviantArt API response.
   * @returns {UserInfoModel} Self.
   */
  addWhoAmIData(whoAmIData) {
    this.userId = whoAmIData.userid;
    this.userName = whoAmIData.username;
    this.userIcon = whoAmIData.usericon;
    this.userType = whoAmIData.type;

    return this;
  }

  /**
   * @description
   * Adds refreshment data.
   *
   * @param {Object} refreshmentData - Data from DeviantArt API.
   * @param {Config} config - The config.
   * @returns {UserInfoModel} Self.
   */
  addRefreshmentData(refreshmentData, config) {
    this.accessToken = refreshmentData.access_token;
    this.refreshToken = refreshmentData.refresh_token;
    this.accessTokenExpires = Date.now() + refreshmentData.expires_in * 1000;
    this.refreshTokenExpires = Date.now() + config.oauthConfig.refreshTokenWindow;

    return this;
  }

  /**
   * @description
   * Replaces tokens with null to revoke them.
   * @returns {UserInfoModel} Self.
   */
  revoke() {
    this.accessToken = null;
    this.accessTokenExpires = null;
    this.refreshToken = null;
    this.refreshTokenExpires = null;

    return this;
  }
}
