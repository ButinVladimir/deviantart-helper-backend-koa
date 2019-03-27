/* eslint-disable class-methods-use-this */

/**
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
   */
  async run() {
    throw new Error('run method should be overrided.');
  }
}

/* eslint-enable class-methods-use-this */
