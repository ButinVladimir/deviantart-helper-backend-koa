import BaseTask from '../base';
import GalleryApi from '../../api/gallery';
import UserDao from '../../dao/user';
import DeviationsDao from '../../dao/deviations';
import Config from '../../config/config';
import DeviationConverter from '../../models/deviation/converter';
import LoadDeviationsTaskModelFactory from '../../models/task/factories/load-deviations-factory';
import LoadDeviationsMetadataTaskModelFactory from '../../models/task/factories/load-deviations-metadata-factory';
import { fetchUserInfoAndCheckAccessToken } from '../../helper';
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
   * @param {Config} config - The config.
   */
  constructor(params, galleryApi, userDao, deviationsDao, config) {
    super();

    this.setParams(params);

    this.galleryApi = galleryApi;
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.config = config;
  }

  /**
   * @override
   * @description
   * Sets task parameters.
   *
   * @param {Object} param0 - Object with parameters.
   */
  setParams({ userId, offset }) {
    this.userId = userId;
    this.offset = offset;
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
      userInfo.accessToken,
      this.offset,
      this.config.apiConfig.limitDeviations,
    );

    console.debug(`Got deviations for ${userInfo.userName}`);
    console.debug(`Has more ${result.has_more}`);
    console.debug(`Next offset ${result.next_offset}`);

    const deviations = result.results.map(d => DeviationConverter.fromApiObject(d));
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
        ),
      );
    }

    if (result.has_more) {
      nextTasks.push(
        LoadDeviationsTaskModelFactory.createModel(this.userId, result.next_offset),
      );
    }

    return nextTasks;
  }
}
