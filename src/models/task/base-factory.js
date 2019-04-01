import TaskModel from './task';

/**
 * The base task model factory.
 * @abstract
 */
export default class BaseTaskModelFactory {
  /**
   * @description
   * Creates TaskModel instance.
   */
  static createModel() {
    throw new Error('createModel method should be overriden');
  }

  /**
   * @description
   * Creates TaskModel instance.
   * Can be used only in descendants of BaseTaskModelFactory
   * or when scheduler worker thread receives task.
   * For other cases please use createModel instead.
   *
   * @param {string} name - Task name.
   * @param {Object} params - Task parameters.
   * @returns {TaskModel} TaskModel instance.
   */
  static createModelRaw(name, params) {
    const task = new TaskModel();

    task.name = name;
    task.params = Object.assign({}, params);
    task.setNotStartedState();

    return task;
  }
}
