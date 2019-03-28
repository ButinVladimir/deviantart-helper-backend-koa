import TasksDao from '../dao/tasks';
import TaskFactory from './factory';

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
   */
  constructor(tasksDao, taskFactory) {
    this.tasksDao = tasksDao;
    this.taskFactory = taskFactory;
    this.tick = this.tick.bind(this);
  }

  /**
   * @description
   * Starts task scheduler.
   */
  start() {
    setInterval(this.tick, 2000);
  }

  /**
   * @description
   * Scheduler tick. During tick scheduler fetches one task from queue and runs it.
   * For internal use only.
   */
  async tick() {
    try {
      const taskModel = await this.tasksDao.getNotStartedTask();

      if (taskModel) {
        console.debug(`Got task ${taskModel.id} to run`);
        taskModel.setStartedState();
        await this.tasksDao.updateTask(taskModel);

        await this.taskFactory.createTaskFromModel(taskModel).run();

        taskModel.setFinishedState();
        await this.tasksDao.updateTask(taskModel);
        console.debug(`Finished running task ${taskModel.id}`);
      }
    } catch (e) {
      console.error(e.message);
      console.error(e.stack);
    }
  }
}
