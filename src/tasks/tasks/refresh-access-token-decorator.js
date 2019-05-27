import BaseTask from '../base';
import AuthApi from '../../api/auth';
import UserDao from '../../dao/user';
import Config from '../../config/config';
import { fetchUserInfoAndCheckRefreshToken, output, mark } from '../../helper';
import TaskModel from '../../models/task/task';

/**
 * Decorator task to refresh user's access token if necessary.
 */
export default class RefreshAccessTokenDecoratorTask extends BaseTask {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} params - Task parameters.
   * @param {BaseTask} task - The actual task.
   * @param {AuthApi} authApi - The auth DeviantArt API.
   * @param {UserDao} userDao - The user DAO.
   * @param {Config} config - The config.
   */
  constructor(params, task, authApi, userDao, config) {
    super();

    this.setParams(params);

    this.task = task;
    this.authApi = authApi;
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
    const userInfo = await fetchUserInfoAndCheckRefreshToken(this.userId, this.userDao);

    if (Date.now() >= userInfo.accessToken.expires) {
      output(`User ${mark(userInfo.userName)} requires token refreshing`);

      await userInfo.setAuthData(
        await this.authApi.refresh(
          this.config.oauthConfig.key,
          this.config.oauthConfig.secret,
          userInfo,
        ),
        this.config,
      );

      await this.userDao.update(userInfo);

      output(`User ${mark(userInfo.userName)} data was refreshed`);
    }

    return this.task.run();
  }
}
