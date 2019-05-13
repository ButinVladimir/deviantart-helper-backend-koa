import { Worker } from 'worker_threads';
import UserInfoOutput from '../output/user/info';
import UserApi from '../api/user';
import UserDao from '../dao/user';
import Config from '../config/config';
import FetchDataTaskModelFactory from '../models/task/factories/fetch-data-factory';
import { fetchUserInfoAndCheckRefreshToken } from '../helper';

/**
 * Logic for user part.
 */
export default class UserLogic {
  /**
   * @description
   * The constructor.
   *
   * @param {UserApi} userApi - DeviantArt user API.
   * @param {UserDao} userDao - User DAO.
   * @param {Worker} schedulerWorker - The task scheduler worker thread.
   * @param {Config} config - Config.
   */
  constructor(userApi, userDao, schedulerWorker, config) {
    this.userApi = userApi;
    this.userDao = userDao;
    this.schedulerWorker = schedulerWorker;
    this.config = config;
  }

  /**
   * @description
   * Returns user info for client.
   *
   * @param {string} userId - The user id.
   * @returns {Object} UserInfo instance.
   */
  async getInfo(userId) {
    const userInfo = await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    return UserInfoOutput.prepareOutput(userInfo);
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

    await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    this.schedulerWorker.postMessage(FetchDataTaskModelFactory.createModel(userId));

    return true;
  }
}
