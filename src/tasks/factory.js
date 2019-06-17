import AuthApi from '../api/auth';
import UserApi from '../api/user';
import GalleryApi from '../api/gallery';
import DeviationApi from '../api/deviation';
import SessionsDao from '../dao/sessions';
import UserDao from '../dao/user';
import DeviationsDao from '../dao/deviations';
import DeviationsMetadataDao from '../dao/deviations-metadata';
import DeviationsMetadataSumDao from '../dao/deviations-metadata-sum';
import Config from '../config/config';
import * as taskNames from '../consts/task-names';
import TaskModel from '../models/task/task';
import BaseTask from './base';
import RefreshAccessTokenTaskDecorator from './tasks/refresh-access-token-decorator';
import LoadUserInfoTask from './tasks/load-user-info';
import FetchDataTask from './tasks/fetch-data';
import FetchDataAllUsersTask from './tasks/fetch-data-all-users';
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
   * @param {UserApi} userApi - DeviantArt user API.
   * @param {GalleryApi} galleryApi - DeviantArt gallery API.
   * @param {DeviationApi} deviationApi - DeviantArt deviation API.
   * @param {SessionsDao} sessionsDao - The sessions DAO.
   * @param {UserDao} userDao - The user DAO.
   * @param {DeviationsDao} deviationsDao - The deviations DAO.
   * @param {DeviationsMetadataDao} deviationsMetadataDao - The deviations metadata DAO.
   * @param {DeviationsMetadataSumDao} deviationsMetadataSumDao - The deviations metadata sum DAO.
   * @param {Config} config - The config.
   */
  constructor(
    authApi,
    userApi,
    galleryApi,
    deviationApi,
    sessionsDao,
    userDao,
    deviationsDao,
    deviationsMetadataDao,
    deviationsMetadataSumDao,
    config,
  ) {
    this.authApi = authApi;
    this.userApi = userApi;
    this.galleryApi = galleryApi;
    this.deviationApi = deviationApi;
    this.sessionsDao = sessionsDao;
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.deviationsMetadataDao = deviationsMetadataDao;
    this.deviationsMetadataSumDao = deviationsMetadataSumDao;
    this.config = config;
  }

  /**
   * @description
   * Creates task from task model, injects dependencies and
   * optionally wraps it in RefreshAccessTokenTaskDecorator.
   *
   * @param {TaskModel} taskModel - The TaskModel instance.
   * @returns {BaseTask} Task.
   */
  createTaskFromModel(taskModel) {
    if (!taskModel) {
      return null;
    }

    const internalTask = this.createTaskFromModelInternal(taskModel);

    if (taskModel.name === taskNames.LOAD_USER_INFO
      || taskModel.name === taskNames.FETCH_DATA_ALL_USERS) {
      return internalTask;
    }

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
      case taskNames.LOAD_USER_INFO:
        return this.createLoadUserInfoTask(taskModel);

      case taskNames.FETCH_DATA_ALL_USERS:
        return this.createFetchDataAllUsersTask();

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

  /**
   * @description
   * Creates LoadUserInfoTask instance from task model and injects dependencies.
   *
   * @param {TaskModel} taskModel - The TaskModel instance.
   * @returns {LoadUserInfoTask} LoadUserInfoTask instance.
   */
  createLoadUserInfoTask(taskModel) {
    return new LoadUserInfoTask(
      taskModel.params,
      this.authApi,
      this.userApi,
      this.userDao,
      this.sessionsDao,
      this.config,
    );
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
    return new FetchDataTask(taskModel.params, this.userDao, this.config);
  }
  /* eslint-enable class-methods-use-this */

  /**
   * @description
   * Creates FetchDataAllUsersTask instance from task model and injects dependencies.
   *
   * @returns {FetchDataAllUsersTask} FetchDataAllUsersTask instance.
   */
  createFetchDataAllUsersTask() {
    return new FetchDataAllUsersTask(this.userDao);
  }

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
      this.deviationsMetadataSumDao,
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
      this.deviationsMetadataSumDao,
      this.config,
    );
  }
}
