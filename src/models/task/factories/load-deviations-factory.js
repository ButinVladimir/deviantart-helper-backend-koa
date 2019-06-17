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
   * @param {string} userId - User ID.
   * @param {number} offset - The offset.
   * @param {string} metadataSumId - The metadata sum ID.
   * @returns {TaskModel} TaskModel instance.
   */
  static createModel(userId, offset, metadataSumId) {
    const params = {
      userId,
      offset,
      metadataSumId,
    };

    return super.createModelRaw(LOAD_DEVIATIONS, params);
  }
}
