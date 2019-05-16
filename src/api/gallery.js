import axios from 'axios';
import querystring from 'querystring';
import * as api from '../consts/api';
import Config from '../config/config';
import UserInfoModel from '../models/user-info/user-info';

/**
 * Wrapper for DeviantART gallery api.
 */
export default class GalleryApi {
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
   * Fetches all deviations from current user.
   *
   * @param {UserInfoModel} userInfo - The user info.
   * @param {number} offset - Current offset.
   * @param {number} limit - Limit of deviations per page.
   * @returns {Object} Response from API.
   */
  async getAll(userInfo, offset, limit) {
    const params = {
      offset,
      limit,
      mature_content: true,
    };

    const accessToken = await userInfo.accessToken.decrypt(this.config);
    const response = await axios.get(
      `${api.GALLERY_ALL}?${querystring.stringify(params)}`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  }
}
