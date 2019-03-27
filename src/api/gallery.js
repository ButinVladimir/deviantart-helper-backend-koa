import axios from 'axios';
import querystring from 'querystring';
import * as api from '../consts/api';

/* eslint-disable class-methods-use-this */

/**
 * Wrapper for DeviantART gallery api.
 */
export default class GalleryApi {
  /**
   * @description
   * Fetches all deviations from current user.
   *
   * @param {string} accessToken - The access token.
   * @param {number} offset - Current offset.
   * @param {number} limit - Limit of deviations per page.
   * @returns {Object} Response from API.
   */
  async getAll(accessToken, offset, limit) {
    const params = {
      offset,
      limit,
    };

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

/* eslint-enable class-methods-use-this */
