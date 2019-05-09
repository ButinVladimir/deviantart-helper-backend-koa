import AuthApi from '../api/auth';
import GalleryApi from '../api/gallery';
import DeviationApi from '../api/deviation';
import UserDao from '../dao/user';
import DeviationsDao from '../dao/deviations';
import DeviationsMetadataDao from '../dao/deviations-metadata';
import Config from '../config/config';
import * as taskNames from '../consts/task-names';
import TaskModel from '../models/task/task';
import BaseTask from './base';
import RefreshAccessTokenTaskDecorator from './tasks/refresh-access-token-decorator';
import FetchDataTask from './tasks/fetch-data';
import LoadDeviationsTask from './tasks/load-deviations';
import LoadDeviationsMetadataTask from './tasks/load-deviations-metadata';

/**
 * @description
 * Class to create task from task model and inject all dependencies.
 */
export default class TaskFactory {
  /**
   * @description
   * The constructor.
   *
   * @param {AuthApi} authApi - DeviantArt auth API.
   * @param {GalleryApi} galleryApi - DeviantArt gallery API.
   * @param {DeviationApi} deviationApi - DeviantArt deviation API.
   * @param {UserDao} userDao - The user DAO.
   * @param {DeviationsDao} deviationsDao - The deviations DAO.
   * @param {DeviationsMetadataDao} deviationsMetadataDao - The deviations metadata DAO.
   * @param {Config} config - The config.
   */
  constructor(
    authApi,
    galleryApi,
    deviationApi,
    userDao,
    deviationsDao,
    deviationsMetadataDao,
    config,
  ) {
    this.authApi = authApi;
    this.galleryApi = galleryApi;
    this.deviationApi = deviationApi;
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.deviationsMetadataDao = deviationsMetadataDao;
    this.config = config;
  }

  /**
   * @description
   * Creates task from task model, injects dependencies and
   * wraps it in RefreshAccessTokenTaskDecorator.
   *
   * @param {TaskModel} taskModel - The TaskModel instance.
   * @returns {BaseTask} Task.
   */
  createTaskFromModel(taskModel) {
    if (!taskModel) {
      return null;
    }

    const internalTask = this.createTaskFromModelInternal(taskModel);

    if (internalTask !== null) {
      return new RefreshAccessTokenTaskDecorator(
        taskModel.params,
        internalTask,
        this.authApi,
        this.userDao,
        this.config,
      );
    }

    return null;
  }

  /**
   * @description
   * Creates task from task model, injects dependencies.
   * Please use createTaskFromModel instead because it adds validation of refresh token
   * and token regeneration if necessary.
   *
   * @param {TaskModel} taskModel - The TaskModel instance.
   * @returns {BaseTask} Task.
   */
  createTaskFromModelInternal(taskModel) {
    switch (taskModel.name) {
      case taskNames.FETCH_DATA:
        return this.createFetchDataTask(taskModel);
      case taskNames.LOAD_DEVIATIONS:
        return this.createLoadDeviationsTask(taskModel);
      case taskNames.LOAD_DEVIATIONS_METADATA:
        return this.createLoadDeviationsMetadataTask(taskModel);
      default:
        return null;
    }
  }

  /* eslint-disable class-methods-use-this */
  /**
   * @description
   * Creates FetchDataTask instance from task model and injects dependencies.
   *
   * @param {TaskModel} taskModel - The TaskModel instance.
   * @returns {FetchDataTask} FetchDataTask instance.
   */
  createFetchDataTask(taskModel) {
    return new FetchDataTask(taskModel.params);
  }
  /* eslint-enable class-methods-use-this */

  /**
   * @description
   * Creates LoadDeviationsTask instance from task model and injects dependencies.
   *
   * @param {TaskModel} taskModel - The TaskModel instance.
   * @returns {LoadDeviationsTask} LoadDeviationsTask instance.
   */
  createLoadDeviationsTask(taskModel) {
    return new LoadDeviationsTask(
      taskModel.params,
      this.galleryApi,
      this.userDao,
      this.deviationsDao,
      this.config,
    );
  }

  /**
   * @description
   * Creates LoadDeviationsMetadataTask instance from task model and injects dependencies.
   *
   * @param {TaskModel} taskModel - The TaskModel instance.
   * @returns {LoadDeviationsTask} LoadDeviationsTask instance.
   */
  createLoadDeviationsMetadataTask(taskModel) {
    return new LoadDeviationsMetadataTask(
      taskModel.params,
      this.deviationApi,
      this.userDao,
      this.deviationsDao,
      this.deviationsMetadataDao,
      this.config,
    );
  }
}
