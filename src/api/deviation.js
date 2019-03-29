import axios from 'axios';
import qs from 'qs';
import * as api from '../consts/api';
import DeviationMetadataModel from '../models/deviation-metadata/deviation-metadata';
import DeviationMetadataModelConverter from '../models/deviation-metadata/converter';

/* eslint-disable class-methods-use-this */

/**
 * Wrapper for DeviantART deviation api.
 */
export default class DeviationApi {
  /**
   * @description
   * Fetches metadata for selected deviations.
   *
   * @param {string} accessToken - The access token.
   * @param {string[]} deviationIds - The array of deviation ids.
   * @returns {DeviationMetadataModel[]} Response from API.
   */
  async getDeviationsMetadata(accessToken, deviationIds) {
    if (deviationIds.length === 0) {
      return [];
    }

    const params = {
      deviationids: deviationIds,
      ext_stats: true,
    };
    console.log(qs.stringify(params));

    const response = await axios.post(
      `${api.DEVIATION_METADATA}`,
      qs.stringify(params),
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data && response.data.metadata
      ? response.data.metadata.map(md => DeviationMetadataModelConverter.fromApiObject(md))
      : [];
  }
}

/* eslint-enable class-methods-use-this */
