import BaseTaskModelFactory from '../base-factory';
import { FETCH_DATA } from '../../../consts/task-names';
import TaskModel from '../task';

/**
 * @description
 * The factory which creates tasks to fetch data from DeviantArt API for single user.
 */
export default class FetchDataTaskModelFactory extends BaseTaskModelFactory {
  /**
   * @override
   * @description
   * Creates TaskModel instance.
   *
   * @param {string} userId - User ID.
   * @returns {TaskModel} TaskModel instance.
   */
  static createModel(userId) {
    const params = {
      userId,
    };

    return super.createModelRaw(FETCH_DATA, params);
  }
}
