import BaseTask from '../base';
import GalleryApi from '../../api/gallery';
import UserDao from '../../dao/user';
import DeviationsDao from '../../dao/deviations';
import DeviationsMetadataSumDao from '../../dao/deviations-metadata-sum';
import Config from '../../config/config';
import DeviationModelConverter from '../../models/deviation/converter';
import LoadDeviationsTaskModelFactory from '../../models/task/factories/load-deviations-factory';
import LoadDeviationsMetadataTaskModelFactory from '../../models/task/factories/load-deviations-metadata-factory';
import DeviationMetadataSumModel from '../../models/deviation-metadata-sum/deviation-metadata-sum';
import { fetchUserInfoAndCheckAccessToken, output, mark } from '../../helper';
import TaskModel from '../../models/task/task';

/**
 * Task to get all deviations from gallery by user.
 */
export default class LoadDeviationsTask extends BaseTask {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} params - Task parameters.
   * @param {GalleryApi} galleryApi - DeviantArt gallery API.
   * @param {UserDao} userDao - The user DAO.
   * @param {DeviationsDao} deviationsDao - The deviations DAO.
   * @param {DeviationsMetadataSumDao} deviationsMetadataSumDao - The deviations metadata sum DAO.
   * @param {Config} config - The config.
   */
  constructor(params, galleryApi, userDao, deviationsDao, deviationsMetadataSumDao, config) {
    super();

    this.setParams(params);

    this.galleryApi = galleryApi;
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
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
  setParams({ userId, offset, metadataSumId }) {
    this.userId = userId;
    this.offset = offset;
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
    const userInfo = await fetchUserInfoAndCheckAccessToken(this.userId, this.userDao);
    const nextTasks = [];

    const result = await this.galleryApi.getAll(
      userInfo,
      this.offset,
      this.config.apiConfig.limitDeviations,
    );

    output(`Got deviations for ${mark(userInfo.userName)}`);
    output(`Has more ${mark(result.has_more)}`);
    output(`Next offset ${mark(result.next_offset)}`);

    if (this.metadataSumId === null) {
      output(`Metadata sum ID is ${mark('null')}, needs to be inserted first`);

      const metadataSum = new DeviationMetadataSumModel();
      metadataSum.setUserId(this.userId);
      metadataSum.setTimestamp();

      this.metadataSumId = await this.deviationsMetadataSumDao.insertMetadataSum(metadataSum);
    }

    output(`Metadata sum ID is ${mark(this.metadataSumId)}`);

    const deviations = result.results.map(d => DeviationModelConverter.fromApiObject(d));
    await this.deviationsDao.batchUpdate(deviations);
    const deviationIds = deviations.map(d => d.id);

    while (deviationIds.length > 0) {
      const deviationIdsSlice = deviationIds.splice(
        0,
        this.config.apiConfig.limitDeviationsMetadata,
      );

      nextTasks.push(
        LoadDeviationsMetadataTaskModelFactory.createModel(
          this.userId,
          deviationIdsSlice,
          this.metadataSumId,
        ),
      );
    }

    if (result.has_more) {
      nextTasks.push(
        LoadDeviationsTaskModelFactory.createModel(
          this.userId,
          result.next_offset,
          this.metadataSumId,
        ),
      );
    }

    return nextTasks;
  }
}
