import Config from '../../config/config';

/**
 * User info object.
 */
export default class UserInfo {
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
   */
  addAuthData(grantResponse, config) {
    this.accessToken = grantResponse.access_token;
    this.refreshToken = grantResponse.refresh_token;
    this.accessTokenExpires = Date.now() + grantResponse.raw.expires_in * 1000;
    this.refreshTokenExpires = Date.now() + config.refreshTokenWindow;
  }

  /**
   * @description
   * Adds 'user/who-am-i' data from DeviantArt API.
   *
   * @param {Object} whoAmIData - DeviantArt API response.
   */
  addWhoAmIData(whoAmIData) {
    this.userId = whoAmIData.userid;
    this.userName = whoAmIData.username;
    this.userIcon = whoAmIData.usericon;
    this.userType = whoAmIData.type;
  }
}
