import axios from 'axios';
import * as api from '../consts/api';
import Config from '../config/config';
import UserInfoModel from '../models/user-info/user-info';

/**
 * Wrapper for DeviantART user api.
 */
export default class UserApi {
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
   * Returns user information.
   *
   * @param {UserInfoModel} userInfo - The user info.
   * @returns {Object} Response.
   */
  async whoAmI(userInfo) {
    const accessToken = await userInfo.accessToken.decrypt(this.config);
    const response = await axios.get(api.USER_WHOAMI, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }
}
