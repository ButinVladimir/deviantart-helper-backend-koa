import BaseTaskModelFactory from '../base-factory';
import { LOAD_DEVIATIONS } from '../../../consts/task-names';
import TaskModel from '../task';

/**
 * @description
 * The factory which creates tasks to load deviations from DeviantArt API.
 */
export default class LoadDeviationsTaskModelFactory extends BaseTaskModelFactory {
  /**
   * @override
   * @description
   * Creates TaskModel instance.
   *
   * @param {number} userId - User ID.
   * @param {number} offset - The offset.
   * @returns {TaskModel} TaskModel instance.
   */
  static createModel(userId, offset) {
    const params = {
      userId,
      offset,
    };

    return super.createModelRaw(LOAD_DEVIATIONS, params);
  }
}
