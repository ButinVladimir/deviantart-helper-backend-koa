import BaseTask from '../base';
import DeviationApi from '../../api/deviation';
import UserDao from '../../dao/user';
import DeviationsMetadataDao from '../../dao/deviations-metadata';
import Config from '../../config/config';
import { fetchUserInfoAndCheckAccessToken } from '../../helper';

/**
 * Task to get deviations metadata by user.
 */
export default class LoadDeviationsMetadataTask extends BaseTask {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} params - Task parameters.
   * @param {DeviationApi} deviationApi - DeviantArt deviation API.
   * @param {UserDao} userDao - The user DAO.
   * @param {DeviationsMetadataDao} deviationsMetadataDao - The deviations DAO.
   * @param {Config} config - The config.
   */
  constructor(params, deviationApi, userDao, deviationsMetadataDao, config) {
    super();

    this.setParams(params);

    this.deviationApi = deviationApi;
    this.userDao = userDao;
    this.deviationsMetadataDao = deviationsMetadataDao;
    this.config = config;
  }

  /**
   * @override
   * @description
   * Sets task parameters.
   *
   * @param {Object} param0 - Object with parameters.
   */
  setParams({ userId, deviationIds }) {
    this.userId = userId;
    this.deviationIds = deviationIds;
  }

  /**
   * @override
   * @description
   * Runs current task.
   *
   * @returns {Promise<undefined>} Nothing.
   */
  async run() {
    const userInfo = await fetchUserInfoAndCheckAccessToken(this.userId, this.userDao);

    const deviationsMetadata = await this.deviationApi.getDeviationsMetadata(
      userInfo.accessToken,
      this.deviationIds,
    );

    console.log('Got deviations metadata for', userInfo.userName);
    console.log('Ids', this.deviationIds);

    await this.deviationsMetadataDao.batchInsert(deviationsMetadata);
  }
}
