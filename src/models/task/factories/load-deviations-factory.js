import BaseTaskModelFactory from '../base-factory';
import { LOAD_DEVIATIONS } from '../../../consts/task-names';
import Task from '../task';

/**
 * @description
 * The factory which creates tasks to load deviation from DeviantArt API.
 */
export default class LoadDeviationsTaskModelFactory extends BaseTaskModelFactory {
  /**
   * @override
   * @description
   * Creates model for task.
   *
   * @param {number} userId - User ID.
   * @param {number} offset - The offset.
   * @returns {Task} Task model.
   */
  static createModel(userId, offset) {
    const params = {
      userId,
      offset,
    };

    return super.createModelInternal(LOAD_DEVIATIONS, params);
  }
}
