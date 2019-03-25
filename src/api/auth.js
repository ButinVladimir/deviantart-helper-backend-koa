import axios from 'axios';
import querystring from 'querystring';
import * as api from '../consts/api';

/* eslint-disable class-methods-use-this */

/**
 * Wrapper for DeviantART auth api.
 */
export default class AuthApi {
  /**
   * @description
   * Revokes user session.
   *
   * @param {string} accessToken - The access token.
   * @returns {boolean} Success of operation.
   */
  async revoke(accessToken) {
    const params = querystring.stringify({ token: accessToken });
    const response = await axios.post(api.AUTH_REVOKE, params, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.success;
  }
}

/* eslint-enable class-methods-use-this */
