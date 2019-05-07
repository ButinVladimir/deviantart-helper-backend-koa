import { Worker } from 'worker_threads';
import UserDao from '../dao/user';
import DeviationsDao from '../dao/deviations';
import DeviationsMetadataDao from '../dao/deviations-metadata';
import Config from '../config/config';
import LoadDeviationsTaskModelFactory from '../models/task/factories/load-deviations-factory';
import DeviationsBrowseInput from '../input/deviations/browse';
import DeviationsDetailsInput from '../input/deviations/details';
import DeviationsMetadataInput from '../input/deviations/metadata';
import DeviationsStatisticsInput from '../input/deviations/statistics';
import DeviationsBrowseOutput from '../output/deviations/browse';
import DeviationsDetailsOutput from '../output/deviations/details';
import DeviationsMetadataOutput from '../output/deviations/metadata';
import DeviationsStatisticsOutput from '../output/deviations/statistics';
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
   * @param {DeviationsBrowseInput} input - The input.
   * @param {number} page - Current page.
   * @returns {Object[]} Deviations.
   */
  async browse(userId, input, page) {
    await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    const deviations = await this.deviationsDao.getThumbnailsByUser(
      userId,
      input,
      page * this.config.daoConfig.limitDeviationsBrowse,
      this.config.daoConfig.limitDeviationsBrowse,
    );
    const pageCount = Math.ceil(
      (await this.deviationsDao.getCountByUser(userId, input))
        / this.config.daoConfig.limitDeviationsBrowse,
    );

    return DeviationsBrowseOutput.prepareOutput(deviations, pageCount);
  }

  /**
   * @description
   * Fetches deviation with details for user.
   *
   * @param {string} userId - The user ID.
   * @param {string} deviationId - The deviation ID.
   * @param {DeviationsDetailsInput} input - The input.
   * @returns {Object} Deviation details.
   */
  async details(userId, deviationId, input) {
    await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    const deviation = await this.deviationsDao.getByIdAndUser(
      userId,
      deviationId,
    );

    if (deviation === null) {
      return null;
    }

    const metadata = input.metadata
      ? await this.deviationsMetadataDao.getByIdAndUser(userId, deviationId, input)
      : null;

    return DeviationsDetailsOutput.prepareOutput(deviation, metadata);
  }

  /**
   * @description
   * Fetches deviations metadata for user.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsMetadataInput} input - The input.
   * @returns {Object} Metadata.
   */
  async metadata(userId, input) {
    await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    const metadata = input.deviationIds
      ? await this.deviationsMetadataDao
        .getByIdsAndUser(userId, input.deviationIds, input)
      : [];

    return DeviationsMetadataOutput.prepareOutput(metadata);
  }

  /**
   * @description
   * Fetches deviations statistics for user.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsStatisticsInput} input - The input.
   * @param {number} page - Current page.
   * @returns {Object} Deviations statistics.
   */
  async statistics(userId, input, page) {
    await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    const deviations = await this.deviationsDao.getStatisticsByUser(
      userId,
      input,
      page * this.config.daoConfig.limitDeviationsStatistics,
      this.config.daoConfig.limitDeviationsStatistics,
    );

    let metadata = null;
    if (input.metadata) {
      metadata = deviations.length > 0
        ? await this.deviationsMetadataDao.getByIdsAndUser(
          userId,
          deviations.map(d => d.id),
          input,
        )
        : [];
    }

    const pageCount = Math.ceil(
      (await this.deviationsDao.getCountByUser(userId, input))
        / this.config.daoConfig.limitDeviationsStatistics,
    );

    return DeviationsStatisticsOutput.prepareOutput(deviations, metadata, pageCount);
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
