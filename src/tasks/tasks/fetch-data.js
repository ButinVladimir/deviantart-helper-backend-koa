import BaseTask from '../base';
import UserDao from '../../dao/user';
import Config from '../../config/config';
import LoadDeviationsTaskModelFactory from '../../models/task/factories/load-deviations-factory';
import TaskModel from '../../models/task/task';
import {
  fetchUserInfoAndCheckAccessToken,
  checkThreshold,
  output,
  mark,
} from '../../helper';

/**
 * Task to start fetching data for single user.
 */
export default class FetchDataTask extends BaseTask {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} params - Task parameters.
   * @param {UserDao} userDao - The user DAO.
   * @param {Config} config - The config.
   */
  constructor(params, userDao, config) {
    super();

    this.setParams(params);

    this.userDao = userDao;
    this.config = config;
  }

  /**
   * @override
   * @description
   * Sets task parameters.
   *
   * @param {Object} param0 - Object with parameters.
   */
  setParams({ userId }) {
    this.userId = userId;
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
    if (!checkThreshold(userInfo.fetchDateThreshold)) {
      output(`Data for user ${mark(userInfo.userName)} cannot be fetched, too soon`);

      return [];
    }

    output(`Data for user ${mark(userInfo.userName)} can be fetched`);
    userInfo.fetchDateThreshold = Date.now() + this.config.schedulerConfig.fetchDataWindow;
    await this.userDao.update(userInfo);

    return [
      LoadDeviationsTaskModelFactory.createModel(this.userId, 0, null),
    ];
  }
}
