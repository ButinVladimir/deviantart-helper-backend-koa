import TaskModel from '../models/task/task';

/* eslint-disable class-methods-use-this */

/**
 * @abstract
 * @description
 * The base task.
 */
export default class BaseTask {
  /**
   * @description
   * Sets task parameters.
   */
  setParams() {
    throw new Error('setParams method should be overrided.');
  }

  /**
   * @description
   * Runs current task.
   *
   * @returns {TaskModel[]} Batch of next tasks.
   */
  async run() {
    throw new Error('run method should be overrided.');
  }
}

/* eslint-enable class-methods-use-this */
