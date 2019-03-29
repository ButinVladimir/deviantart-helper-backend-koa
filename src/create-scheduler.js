import { Db } from 'mongodb';
import Config from './config/config';

import GalleryApi from './api/gallery';
import DeviationApi from './api/deviation';

import UserDao from './dao/user';
import DeviationsDao from './dao/deviations';
import DeviationsMetadataDao from './dao/deviations-metadata';
import TasksDao from './dao/tasks';

import TaskFactory from './tasks/factory';
import TaskScheduler from './tasks/scheduler';

/**
 * @description
 * Creates task scheduler instance and binds it to the MongoDB and DeviantArt API.
 *
 * @param {Db} db - The MongoDB database.
 * @param {Config} config - The config.
 * @returns {TaskScheduler} Application.
 */
export default (db, config) => {
  const galleryApi = new GalleryApi();
  const deviationApi = new DeviationApi();

  const userDao = new UserDao(db);
  const deviationsDao = new DeviationsDao(db);
  const deviationsMetadataDao = new DeviationsMetadataDao(db);
  const tasksDao = new TasksDao(db);

  const taskFactory = new TaskFactory(
    galleryApi,
    deviationApi,
    userDao,
    deviationsDao,
    deviationsMetadataDao,
    tasksDao,
    config,
  );
  const taskScheduler = new TaskScheduler(tasksDao, taskFactory);

  return taskScheduler;
};
