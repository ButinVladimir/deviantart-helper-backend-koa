import Task from './task';

/**
 * Class to convert object from and into the Task objects.
 */
export default class TaskConverter {
  /**
   * @description
   * Converts Task to DB object.
   *
   * @param {Task} task - Task instance.
   * @returns {Object} DB object.
   */
  static toDbObject(task) {
    return {
      state: task.state,
      name: task.name,
      params: Object.assign({}, task.params),
      creationTime: task.creationTime,
      startTime: task.startTime,
      finishTime: task.finishTime,
    };
  }

  /**
   * @description
   * Converts DB object to Task.
   *
   * @param {Object} dbObject - DB object.
   * @returns {Task} Task instance.
   */
  static fromDbObject(dbObject) {
    const task = new Task();

    // eslint-disable-next-line no-underscore-dangle
    task.id = dbObject._id;
    task.state = dbObject.state;
    task.name = dbObject.name;
    task.params = Object.assign({}, dbObject.params);
    task.creationTime = dbObject.creationTime;
    task.startTime = dbObject.startTime;
    task.finishTime = dbObject.finishTime;

    return task;
  }
}
