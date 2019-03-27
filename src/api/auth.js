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
   * @param {string} refreshToken - The refresh token.
   * @returns {boolean} Success of operation.
   */
  async revoke(refreshToken) {
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
   * @param {string} refreshToken - The refresh token.
   * @returns {Object} Object with refreshment info.
   */
  async refresh(clientId, clientSecret, refreshToken) {
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

/* eslint-enable class-methods-use-this */
