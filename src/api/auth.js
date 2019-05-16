import axios from 'axios';
import querystring from 'querystring';
import * as api from '../consts/api';
import Config from '../config/config';
import UserInfoModel from '../models/user-info/user-info';

/**
 * Wrapper for DeviantART auth api.
 */
export default class AuthApi {
  /**
   * @description
   * The constructor.
   *
   * @param {Config} config - The config.
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * @description
   * Revokes user session.
   *
   * @param {UserInfoModel} userInfo - The user info.
   * @returns {boolean} Success of operation.
   */
  async revoke(userInfo) {
    const refreshToken = await userInfo.refreshToken.decrypt(this.config);
    const params = { token: refreshToken };
    const response = await axios.post(api.AUTH_REVOKE, querystring.stringify(params));

    return response.data.success;
  }

  /**
   * @description
   * Refreshes user session.
   *
   * @param {string} clientId - The client app id.
   * @param {string} clientSecret - The client app secret.
   * @param {UserInfoModel} userInfo - The user info.
   * @returns {Object} Object with refreshment info.
   */
  async refresh(clientId, clientSecret, userInfo) {
    const refreshToken = await userInfo.refreshToken.decrypt(this.config);
    const params = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    const response = await axios.post(api.AUTH_TOKEN, querystring.stringify(params));

    return response.data;
  }
}
