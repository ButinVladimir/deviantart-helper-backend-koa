import Task from './task';

/**
 * The base task model factory.
 */
export default class BaseTaskModelFactory {
  /**
   * @description
   * Creates model for task.
   */
  static createModel() {
    throw new Error('createModel method should be overriden');
  }

  /**
   * @description
   * Creates model for task.
   * Can be used only in descendants of BaseTaskModelFactory.
   * For other cases please use createModel instead.
   *
   * @param {string} name - Task name.
   * @param {Object} params - Task parameters.
   * @returns {Task} Task model.
   */
  static createModelInternal(name, params) {
    const task = new Task();

    task.name = name;
    task.params = params;
    task.setNotStartedState();

    return task;
  }
}
