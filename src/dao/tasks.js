import { Db } from 'mongodb';
import { COLLECTION_TASKS } from '../consts/collections';
import { NOT_STARTED } from '../consts/task-states';
import Task from '../models/task/task';
import TaskConverter from '../models/task/converter';

/**
 * Tasks DAO class.
 */
export default class TasksDao {
  /**
   * @description
   * The constructor.
   *
   * @param {Db} db - The database.
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * @description
   * Batch insert of tasks.
   *
   * @param {Task[]} tasks - Array of Task instances.
   * @returns {undefined} Nothing.
   */
  async batchInsert(tasks) {
    const operations = tasks.map(t => ({
      insertOne: {
        document: TaskConverter.toDbObject(t),
      },
    }));

    await this.db.collection(COLLECTION_TASKS).bulkWrite(
      operations,
      { ordered: false },
    );
  }

  /**
   * @description
   * Fetches single task which hasn't been started.
   *
   * @returns {Task} Fetched task.
   */
  async getNotStartedTask() {
    const dbObjects = await this.db.collection(COLLECTION_TASKS)
      .find({ state: NOT_STARTED }, { limit: 1 })
      .toArray();

    return dbObjects && dbObjects.length > 0
      ? TaskConverter.fromDbObject(dbObjects[0])
      : null;
  }

  /**
   * @description
   * Updates task.
   *
   * @param {Task} task - Task instance.
   */
  async updateTask(task) {
    await this.db.collection(COLLECTION_TASKS).updateOne(
      { _id: task.id },
      { $set: TaskConverter.toDbObject(task) },
    );
  }
}
