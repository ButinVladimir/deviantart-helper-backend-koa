import BaseTask from '../base';
import UserDao from '../../dao/user';
import FetchDataTaskModelFactory from '../../models/task/factories/fetch-data-factory';
import TaskModel from '../../models/task/task';

/**
 * Task to start fetching data for all eligible users.
 */
export default class FetchDataAllUsersTask extends BaseTask {
  /**
   * @description
   * The constructor.
   *
   * @param {UserDao} userDao - The user DAO.
   */
  constructor(userDao) {
    super();

    this.userDao = userDao;
  }

  /**
   * @override
   * @description
   * Sets task parameters.
   *
   * @param {Object} param0 - Object with parameters.
   */
  // eslint-disable-next-line class-methods-use-this
  setParams() {
  }

  /**
   * @override
   * @description
   * Runs current task.
   *
   * @returns {Promise<TaskModel[]>} Batch of next tasks.
   */
  async run() {
    const userIds = await this.userDao.getUserIdsForRefreshing();

    return userIds.map(id => FetchDataTaskModelFactory.createModel(id));
  }
}
