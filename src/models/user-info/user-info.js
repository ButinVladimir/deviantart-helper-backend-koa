import Config from '../../config/config';
import TokenModel from '../token/token';

/**
 * User info model object.
 */
export default class UserInfoModel {
  /**
   * @description
   * The constructor.
   */
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.userId = '';
    this.userName = '';
    this.userIcon = '';
    this.userType = '';
    this.fetchDateThreshold = null;
    this.requestDateThreshold = null;
  }

  /**
   * @description
   * Adds auth data.
   *
   * @param {Object} grantResponse - Response from grant.
   * @param {Config} config - The config.
   * @returns {UserInfoModel} Self.
   */
  async setAuthData(grantResponse, config) {
    this.accessToken = new TokenModel();
    await this.accessToken.encrypt(
      grantResponse.access_token,
      Date.now() + config.oauthConfig.accessTokenWindow,
      config,
    );

    this.refreshToken = new TokenModel();
    await this.refreshToken.encrypt(
      grantResponse.refresh_token,
      Date.now() + config.oauthConfig.refreshTokenWindow,
      config,
    );

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
   * Replaces tokens with null to revoke them.
   * @returns {UserInfoModel} Self.
   */
  revoke() {
    this.accessToken = null;
    this.refreshToken = null;

    return this;
  }
}
