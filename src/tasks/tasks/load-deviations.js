import BaseTask from '../base';
import GalleryApi from '../../api/gallery';
import UserDao from '../../dao/user';
import DeviationsDao from '../../dao/deviations';
import TasksDao from '../../dao/tasks';
import Config from '../../config/config';
import DeviationConverter from '../../models/deviation/converter';
import LoadDeviationsTaskModelFactory from '../../models/task/factories/load-deviations-factory';
import LoadDeviationsMetadataTaskModelFactory from '../../models/task/factories/load-deviations-metadata-factory';
import { fetchUserInfoAndCheckAccessToken } from '../../helper';

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
   * @param {TasksDao} tasksDao - The tasks DAO.
   * @param {Config} config - The config.
   */
  constructor(params, galleryApi, userDao, deviationsDao, tasksDao, config) {
    super();

    this.setParams(params);

    this.galleryApi = galleryApi;
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.tasksDao = tasksDao;
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
   * @returns {Promise<undefined>} Nothing.
   */
  async run() {
    const userInfo = await fetchUserInfoAndCheckAccessToken(this.userId, this.userDao);

    const result = await this.galleryApi.getAll(
      userInfo.accessToken,
      this.offset,
      this.config.apiLimitDeviationsBrowse,
    );

    console.log('Got deviations for', userInfo.userName);
    console.log('Has more', result.has_more);
    console.log('Next offset', result.next_offset);

    const deviations = result.results.map(d => DeviationConverter.fromApiObject(d));
    await this.deviationsDao.batchUpdate(deviations);

    this.tasksDao.batchInsert([
      LoadDeviationsMetadataTaskModelFactory.createModel(this.userId, deviations.map(d => d.id)),
    ]);

    if (result.has_more) {
      this.tasksDao.batchInsert([
        LoadDeviationsTaskModelFactory.createModel(this.userId, result.next_offset),
      ]);
    }
  }
}
