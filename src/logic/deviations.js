import { Worker } from 'worker_threads';
import UserDao from '../dao/user';
import DeviationsDao from '../dao/deviations';
import Config from '../config/config';
import DeviationConverter from '../models/deviation/converter';
import LoadDeviationsTaskModelFactory from '../models/task/factories/load-deviations-factory';
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
   * @param {Worker} schedulerWorker - The task scheduler worker thread.
   * @param {Config} config - Config.
   */
  constructor(userDao, deviationsDao, schedulerWorker, config) {
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.schedulerWorker = schedulerWorker;
    this.config = config;
  }

  /**
   * @description
   * Fetches all deviations for user.
   *
   * @param {string} userId - The user ID.
   * @param {number} offset - Current offset.
   * @returns {Object[]} Deviations.
   */
  async browse(userId, offset) {
    await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    const deviations = await this.deviationsDao.getByUser(
      userId,
      offset,
      this.config.daoConfig.limitDeviationsBrowse,
    );

    return deviations.map(d => DeviationConverter.toClientObject(d));
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
