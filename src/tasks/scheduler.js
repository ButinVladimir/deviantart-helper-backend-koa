import TasksDao from '../dao/tasks';
import TaskFactory from './factory';
import TaskModel from '../models/task/task';
import Config from '../config/config';
import * as taskResults from '../consts/task-result';

/**
 * Task scheduler.
 */
export default class TaskScheduler {
  /**
   * @description
   * The constructor.
   *
   * @param {TasksDao} tasksDao - The tasks DAO.
   * @param {TaskFactory} taskFactory - The task factory.
   * @param {Config} config - The config.
   */
  constructor(tasksDao, taskFactory, config) {
    this.tasksDao = tasksDao;
    this.taskFactory = taskFactory;
    this.config = config;

    this.attempt = 0;
    this.currentTaskModel = null;
    this.nextTaskModels = [];
    this.delay = config.schedulerConfig.minDelay;

    this.tick = this.tick.bind(this);
  }

  /**
   * @description
   * Starts task scheduler.
   */
  start() {
    setTimeout(this.tick, this.delay);
  }

  /**
   * @description
   * Scheduler tick. During tick scheduler fetches one task from queue and runs it.
   * For internal use only.
   */
  async tick() {
    try {
      await this.setCurrentTask();

      if (this.currentTaskModel) {
        await this.handleCurrentTask();
      }
    } catch (e) {
      console.error(e.message);
      console.error(e.stack);
    }

    setTimeout(this.tick, this.delay);
  }

  /**
   * @description
   * Adds tasks to the queue.
   *
   * @param {TaskModel[]} taskModels - Batch of tasks moddels to be runned.
   */
  async addTasks(taskModels) {
    if (taskModels && taskModels.length > 0) {
      await this.tasksDao.batchInsert(taskModels);
    }
  }

  /**
   * @description
   * Updates current task if scheduler doesn't work on any.
   */
  async setCurrentTask() {
    if (this.currentTaskModel === null) {
      this.currentTaskModel = await this.tasksDao.getNotStartedTask();
      this.attempt = 0;
    }
  }

  /**
   * @description
   * Handles running of selected task, updating it's state
   * and updating delay before next task can be runned.
   */
  async handleCurrentTask() {
    console.debug(`Got task ${this.currentTaskModel.name} with id ${this.currentTaskModel.id} to run`);

    this.currentTaskModel.setStartedState();
    await this.tasksDao.updateTask(this.currentTaskModel);
    this.nextTaskModels = [];
    const taskResult = await this.runCurrentTask();

    if (taskResult === taskResults.SUCCESS) {
      await this.handleCurrentTaskSuccess();
    } else {
      await this.handleCurrentTaskFailure(taskResult);
    }

    console.debug(`Next delay will be ${this.delay}`);
    console.debug();
  }

  /**
   * @description
   * Handles task when the result is successful.
   */
  async handleCurrentTaskSuccess() {
    console.debug(`Finished running task ${this.currentTaskModel.id}`);

    this.currentTaskModel.setFinishedState();
    await this.tasksDao.updateTask(this.currentTaskModel);
    await this.addTasks(this.nextTaskModels);

    console.debug(`Set status of task ${this.currentTaskModel.id} to 'Finished'`);
    if (this.nextTaskModels.length > 0) {
      console.debug('Added new tasks');
    } else {
      console.debug('No more tasks to add');
    }

    this.currentTaskModel = null;
    this.attempt = 0;
    this.delay = Math.max(
      this.config.schedulerConfig.minDelay,
      Math.round(this.delay * this.config.schedulerConfig.successDelayCoefficient),
    );
  }

  /**
   * @description
   * Handles task when the result is failure.
   *
   * @param {number} taskResult - Task result.
   */
  async handleCurrentTaskFailure(taskResult) {
    console.debug(`Failed running task ${this.currentTaskModel.id}`);

    if (taskResult === taskResults.FAILURE
      || this.attempt >= this.config.schedulerConfig.maxAttempts) {
      this.currentTaskModel.setFailedState();
      await this.tasksDao.updateTask(this.currentTaskModel);

      console.debug(`Set status of task ${this.currentTaskModel.id} to 'Failed'`);

      this.currentTaskModel = null;
      this.attempt = 0;
    }

    if (taskResult === taskResults.TOO_MANY_REQUESTS) {
      this.delay = Math.min(
        this.config.schedulerConfig.maxDelay,
        Math.round(this.delay * this.config.schedulerConfig.failureDelayCoefficient),
      );
    }
  }

  /**
   * @description
   * Executes current task and updates list of next task models.
   *
   * @returns {number} Result of operation.
   */
  async runCurrentTask() {
    /* eslint-disable no-await-in-loop */
    try {
      this.attempt += 1;
      console.debug(`Attempt ${this.attempt}`);

      this.nextTaskModels = await this.taskFactory.createTaskFromModel(this.currentTaskModel).run();

      return taskResults.SUCCESS;
    } catch (e) {
      console.error(e.message);
      console.error(e.stack);

      if (e.response && e.response.status === 429) {
        return taskResults.TOO_MANY_REQUESTS;
      }
    }
    /* eslint-enable no-await-in-loop */

    return taskResults.FAILURE;
  }
}
