import BaseTask from '../base';
import LoadDeviationsTaskModelFactory from '../../models/task/factories/load-deviations-factory';
import TaskModel from '../../models/task/task';

/**
 * Task to start fetching data for single user.
 */
export default class FetchDataTask extends BaseTask {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} params - Task parameters.
   */
  constructor(params) {
    super();

    this.setParams(params);
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
    return [
      LoadDeviationsTaskModelFactory.createModel(this.userId, 0),
    ];
  }
}
