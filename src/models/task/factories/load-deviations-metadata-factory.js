import BaseTaskModelFactory from '../base-factory';
import { LOAD_DEVIATIONS_METADATA } from '../../../consts/task-names';
import Task from '../task';

/**
 * @description
 * The factory which creates tasks to load deviations metadata from DeviantArt API.
 */
export default class LoadDeviationsMetadataTaskModelFactory extends BaseTaskModelFactory {
  /**
   * @override
   * @description
   * Creates model for task.
   *
   * @param {number} userId - User ID.
   * @param {string[]} deviationIds - Deviations IDs.
   * @returns {Task} Task model.
   */
  static createModel(userId, deviationIds) {
    const params = {
      userId,
      deviationIds: Array.from(deviationIds),
    };

    return super.createModelInternal(LOAD_DEVIATIONS_METADATA, params);
  }
}
