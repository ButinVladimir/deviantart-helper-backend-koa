import GalleryApi from '../api/gallery';
import UserDao from '../dao/user';
import DeviationsDao from '../dao/deviations';
import TasksDao from '../dao/tasks';
import Config from '../config/config';
import * as taskNames from '../consts/task-names';
import TaskModel from '../models/task/task';
import BaseTask from './base';
import LoadDeviationsTask from './tasks/load-deviations';

/**
 * @description
 * Class to create task from task model and inject all dependencies.
 */
export default class TaskFactory {
  /**
   * @description
   * The constructor.
   *
   * @param {GalleryApi} galleryApi - DeviantArt gallery API.
   * @param {UserDao} userDao - The user DAO.
   * @param {DeviationsDao} deviationsDao - The deviations DAO.
   * @param {TasksDao} tasksDao - The tasks DAO.
   * @param {Config} config - The config.
   */
  constructor(galleryApi, userDao, deviationsDao, tasksDao, config) {
    this.galleryApi = galleryApi;
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.tasksDao = tasksDao;
    this.config = config;
  }

  /**
   * @description
   * Creates task from task model and injects dependencies.
   *
   * @param {TaskModel} taskModel - The task model.
   * @returns {BaseTask} Task.
   */
  createTaskFromModel(taskModel) {
    if (!taskModel) {
      return null;
    }

    switch (taskModel.name) {
      case taskNames.LOAD_DEVIATIONS:
        return new LoadDeviationsTask(
          taskModel.params,
          this.galleryApi,
          this.userDao,
          this.deviationsDao,
          this.tasksDao,
          this.config,
        );
      default:
        return null;
    }
  }
}
