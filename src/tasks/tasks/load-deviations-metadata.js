import BaseTask from '../base';
import DeviationApi from '../../api/deviation';
import UserDao from '../../dao/user';
import DeviationsDao from '../../dao/deviations';
import DeviationsMetadataDao from '../../dao/deviations-metadata';
import DeviationModelConverter from '../../models/deviation/converter';
import DeviationMetadataModelConverter from '../../models/deviation-metadata/converter';
import Config from '../../config/config';
import { fetchUserInfoAndCheckAccessToken } from '../../helper';
import TaskModel from '../../models/task/task';

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
   * @param {DeviationsDao} deviationsDao - The deviations DAO.
   * @param {DeviationsMetadataDao} deviationsMetadataDao - The deviations metadata DAO.
   * @param {Config} config - The config.
   */
  constructor(params, deviationApi, userDao, deviationsDao, deviationsMetadataDao, config) {
    super();

    this.setParams(params);

    this.deviationApi = deviationApi;
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
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
   * @returns {Promise<TaskModel[]>} Batch of next tasks.
   */
  async run() {
    const userInfo = await fetchUserInfoAndCheckAccessToken(this.userId, this.userDao);

    const data = await this.deviationApi.getDeviationsMetadata(
      userInfo.accessToken,
      this.deviationIds,
    );

    if (data.metadata && data.metadata.length > 0) {
      const deviationsMetadata = data.metadata
        .map(dm => DeviationMetadataModelConverter
          .fromApiObject(dm)
          .setUserId(this.userId));

      console.debug('Got deviations metadata for', userInfo.userName);

      await this.deviationsMetadataDao.batchInsert(deviationsMetadata);
      await this.deviationsDao.batchUpdateMetadata(deviationsMetadata
        .map(dm => DeviationModelConverter.fromMetadata(dm)));
    }

    return [];
  }
}
