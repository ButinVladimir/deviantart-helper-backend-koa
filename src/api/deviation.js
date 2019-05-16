import axios from 'axios';
import qs from 'qs';
import * as api from '../consts/api';
import Config from '../config/config';
import UserInfoModel from '../models/user-info/user-info';
import DeviationMetadataModel from '../models/deviation-metadata/deviation-metadata';

/**
 * Wrapper for DeviantART deviation api.
 */
export default class DeviationApi {
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
   * Fetches metadata for selected deviations.
   *
   * @param {UserInfoModel} userInfo - The user info.
   * @param {string[]} deviationIds - The array of deviation ids.
   * @returns {DeviationMetadataModel[]} Response from API.
   */
  async getDeviationsMetadata(userInfo, deviationIds) {
    if (deviationIds.length === 0) {
      return [];
    }

    const params = {
      deviationids: deviationIds,
      ext_stats: true,
    };

    const accessToken = await userInfo.accessToken.decrypt(this.config);
    const response = await axios.post(
      `${api.DEVIATION_METADATA}`,
      qs.stringify(params),
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  }
}
