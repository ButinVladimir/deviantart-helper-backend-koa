import TasksDao from '../dao/tasks';
import TaskFactory from './factory';
import TaskModel from '../models/task/task';
import Config from '../config/config';
import * as taskResults from '../consts/task-result';
import { output, outputError, mark } from '../helper';

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
      output(e.message);
      output(e.stack);
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
    output(`Got task ${mark(this.currentTaskModel.name)} with id ${mark(this.currentTaskModel.id)} to run`);

    this.currentTaskModel.setStartedState();
    await this.tasksDao.updateTask(this.currentTaskModel);
    this.nextTaskModels = [];
    const taskResult = await this.runCurrentTask();

    if (taskResult === taskResults.SUCCESS) {
      await this.handleCurrentTaskSuccess();
    } else {
      await this.handleCurrentTaskFailure(taskResult);
    }

    output(`Next delay will be ${mark(this.delay)}`);
    console.debug();
  }

  /**
   * @description
   * Handles task when the result is successful.
   */
  async handleCurrentTaskSuccess() {
    output(`Finished running task ${mark(this.currentTaskModel.id)}`);

    this.currentTaskModel.setFinishedState();
    await this.tasksDao.updateTask(this.currentTaskModel);
    await this.addTasks(this.nextTaskModels);

    output(`Set status of task ${mark(this.currentTaskModel.id)} to ${mark('Finished')}`);
    if (this.nextTaskModels.length > 0) {
      output('Added new tasks');
    } else {
      output('No more tasks to add');
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
    output(`Failed running task ${mark(this.currentTaskModel.id)}`);

    if (taskResult === taskResults.FAILURE
      || this.attempt >= this.config.schedulerConfig.maxAttempts) {
      this.currentTaskModel.setFailedState();
      await this.tasksDao.updateTask(this.currentTaskModel);

      output(`Set status of task ${mark(this.currentTaskModel.id)} to ${mark('Failed')}`);

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
      output(`Attempt ${mark(this.attempt)}`);

      this.nextTaskModels = await this.taskFactory.createTaskFromModel(this.currentTaskModel).run();

      return taskResults.SUCCESS;
    } catch (e) {
      outputError(e.message);
      outputError(e.stack);

      if (e.response && e.response.status === 429) {
        return taskResults.TOO_MANY_REQUESTS;
      }
    }
    /* eslint-enable no-await-in-loop */

    return taskResults.FAILURE;
  }
}
