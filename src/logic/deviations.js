import { Worker } from 'worker_threads';
import UserDao from '../dao/user';
import DeviationsDao from '../dao/deviations';
import DeviationsMetadataDao from '../dao/deviations-metadata';
import Config from '../config/config';
import LoadDeviationsTaskModelFactory from '../models/task/factories/load-deviations-factory';
import DeviationsBrowseFilter from '../filter/deviations/browse';
import DeviationsDetailsFilter from '../filter/deviations/details';
import DeviationsBrowseOutput from '../output/deviations/browse';
import DeviationsDetailsOutput from '../output/deviations/details';
import { fetchUserInfoAndCheckRefreshToken } from '../helper';

/**
 * Logic for deviations part.
 */
export default class DeviationsLogic {
  /**
   * @description
   * The constructor.
   *
   * @param {UserDao} userDao - User DAO.
   * @param {DeviationsDao} deviationsDao - Deviations DAO.
   * @param {DeviationsMetadataDao} deviationsMetadataDao - Deviations metadata DAO.
   * @param {Worker} schedulerWorker - The task scheduler worker thread.
   * @param {Config} config - Config.
   */
  constructor(userDao, deviationsDao, deviationsMetadataDao, schedulerWorker, config) {
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.deviationsMetadataDao = deviationsMetadataDao;
    this.schedulerWorker = schedulerWorker;
    this.config = config;
  }

  /**
   * @description
   * Fetches all deviations for user.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsBrowseFilter} filter - The filter.
   * @param {number} page - Current page.
   * @returns {Object[]} Deviations.
   */
  async browse(userId, filter, page) {
    await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    const deviations = await this.deviationsDao.getThumbnailsByUser(
      userId,
      filter,
      page * this.config.daoConfig.limitDeviationsBrowse,
      this.config.daoConfig.limitDeviationsBrowse,
    );
    const pagesCount = Math.ceil(
      (await this.deviationsDao.getCountByUser(userId, filter))
        / this.config.daoConfig.limitDeviationsBrowse,
    );

    return DeviationsBrowseOutput.prepareOutput(deviations, pagesCount);
  }

  /**
   * @description
   * Fetches deviation with details for user.
   *
   * @param {string} userId - The user ID.
   * @param {string} deviationId - The deviation ID.
   * @param {DeviationsDetailsFilter} filter - The filter.
   * @returns {Object[]} Deviations.
   */
  async details(userId, deviationId, filter) {
    await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    const deviation = await this.deviationsDao.getByIdAndUser(
      userId,
      deviationId,
    );

    if (deviation === null) {
      return null;
    }

    const metadata = await this.deviationsMetadataDao.getByIdAndUser(userId, deviationId, filter);

    return DeviationsDetailsOutput.prepareOutput(deviation, metadata);
  }

  /**
   * @description
   * Starts task to fetch all deviations for user from DeviantArt API.
   *
   * @param {string} userId - The user ID.
   */
  async startLoadDeviationsTask(userId) {
    await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    this.schedulerWorker.postMessage(LoadDeviationsTaskModelFactory.createModel(userId, 0));
  }
}
