import { Worker } from 'worker_threads';
import UserInfoOutput from '../output/user/info';
import UserDao from '../dao/user';
import { FULLY_LOGINNED } from '../consts/user-states';
import Config from '../config/config';
import FetchDataTaskModelFactory from '../models/task/factories/fetch-data-factory';
import { fetchUserInfoAndCheckRefreshToken, checkThreshold } from '../helper';

/**
 * Logic for user part.
 */
export default class UserLogic {
  /**
   * @description
   * The constructor.
   *
   * @param {UserDao} userDao - User DAO.
   * @param {Worker} schedulerWorker - The task scheduler worker thread.
   * @param {Config} config - Config.
   */
  constructor(userDao, schedulerWorker, config) {
    this.userDao = userDao;
    this.schedulerWorker = schedulerWorker;
    this.config = config;
  }

  /**
   * @description
   * Returns user info for client.
   *
   * @param {string} userId - The user id.
   * @param {number} state - The user state.
   * @returns {Object} UserInfo instance.
   */
  async getInfo(userId, state) {
    const fullyLoginned = state === FULLY_LOGINNED;

    let userInfo = null;
    if (fullyLoginned) {
      userInfo = await this.userDao.getById(userId);
    }

    return UserInfoOutput.prepareOutput(fullyLoginned, userInfo);
  }

  /**
   * @description
   * Starts task to fetch data for user from DeviantArt API.
   *
   * @param {string} userId - The user ID.
   * @returns {boolean} Was user able to request data fetching.
   */
  async startFetchDataTask(userId) {
    if (this.config.schedulerConfig.readOnly) {
      return false;
    }

    const userInfo = await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    if (!checkThreshold(userInfo.fetchDateThreshold)
      || !checkThreshold(userInfo.requestDateThreshold)) {
      return false;
    }

    userInfo.requestDateThreshold = Date.now() + this.config.schedulerConfig.requestFetchDataWindow;
    await this.userDao.update(userInfo);

    this.schedulerWorker.postMessage(FetchDataTaskModelFactory.createModel(userId));

    return true;
  }
}
