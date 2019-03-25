import axios from 'axios';
import * as api from '../consts/api';

/* eslint-disable class-methods-use-this */

/**
 * Wrapper for DeviantART user api.
 */
export default class UserApi {
  /**
   * @description
   * Returns user information.
   *
   * @param {string} accessToken - The access token.
   * @returns {Object} Response.
   */
  async whoAmI(accessToken) {
    const response = await axios.get(api.USER_WHOAMI, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }
}

/* eslint-enable class-methods-use-this */
