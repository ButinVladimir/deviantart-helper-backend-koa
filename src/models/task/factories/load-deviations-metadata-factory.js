import BaseTaskModelFactory from '../base-factory';
import { LOAD_DEVIATIONS_METADATA } from '../../../consts/task-names';
import TaskModel from '../task';

/**
 * @description
 * The factory which creates tasks to load deviations metadata from DeviantArt API.
 */
export default class LoadDeviationsMetadataTaskModelFactory extends BaseTaskModelFactory {
  /**
   * @override
   * @description
   * Creates TaskModel instance.
   *
   * @param {number} userId - User ID.
   * @param {string[]} deviationIds - Deviations IDs.
   * @returns {TaskModel} TaskModel instance.
   */
  static createModel(userId, deviationIds) {
    const params = {
      userId,
      deviationIds: Array.from(deviationIds),
    };

    return super.createModelRaw(LOAD_DEVIATIONS_METADATA, params);
  }
}
