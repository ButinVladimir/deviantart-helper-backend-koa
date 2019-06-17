import BaseTask from '../base';
import DeviationApi from '../../api/deviation';
import UserDao from '../../dao/user';
import DeviationsDao from '../../dao/deviations';
import DeviationsMetadataDao from '../../dao/deviations-metadata';
import DeviationsMetadataSumDao from '../../dao/deviations-metadata-sum';
import DeviationModelConverter from '../../models/deviation/converter';
import DeviationMetadataModelConverter from '../../models/deviation-metadata/converter';
import DeviationMetadataSumModel from '../../models/deviation-metadata-sum/deviation-metadata-sum';
import Config from '../../config/config';
import { fetchUserInfoAndCheckAccessToken, output, mark } from '../../helper';
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
   * @param {DeviationsMetadataSumDao} deviationsMetadataSumDao - The deviations metadata sum DAO.
   * @param {Config} config - The config.
   */
  constructor(
    params,
    deviationApi,
    userDao,
    deviationsDao,
    deviationsMetadataDao,
    deviationsMetadataSumDao,
    config,
  ) {
    super();

    this.setParams(params);

    this.deviationApi = deviationApi;
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.deviationsMetadataDao = deviationsMetadataDao;
    this.deviationsMetadataSumDao = deviationsMetadataSumDao;
    this.config = config;
  }

  /**
   * @override
   * @description
   * Sets task parameters.
   *
   * @param {Object} param0 - Object with parameters.
   */
  setParams({ userId, deviationIds, metadataSumId }) {
    this.userId = userId;
    this.deviationIds = deviationIds;
    this.metadataSumId = metadataSumId;
  }

  /**
   * @override
   * @description
   * Runs current task.
   *
   * @returns {Promise<TaskModel[]>} Batch of next tasks.
   */
  async run() {
    if (this.metadataSumId === null) {
      throw new Error('Metadata sum ID cannot be null');
    }

    const userInfo = await fetchUserInfoAndCheckAccessToken(this.userId, this.userDao);

    const data = await this.deviationApi.getDeviationsMetadata(
      userInfo,
      this.deviationIds,
    );

    if (data.metadata && data.metadata.length > 0) {
      const deviationsMetadata = data.metadata
        .map(dm => DeviationMetadataModelConverter
          .fromApiObject(dm)
          .setUserId(this.userId));

      output(`Got deviations metadata for ${mark(userInfo.userName)}`);

      await this.deviationsMetadataDao.batchInsert(deviationsMetadata);
      await this.deviationsDao.batchUpdateMetadata(deviationsMetadata
        .map(dm => DeviationModelConverter.fromMetadata(dm)));

      output('Added metadata to collection');

      const metadataSum = new DeviationMetadataSumModel();
      metadataSum.setId(this.metadataSumId);
      metadataSum.setUserId(this.userId);
      deviationsMetadata.forEach(dm => metadataSum.addStats(dm));

      await this.deviationsMetadataSumDao.updateMetadataSum(metadataSum);

      output('Updated metadata sum');
    }

    return [];
  }
}
