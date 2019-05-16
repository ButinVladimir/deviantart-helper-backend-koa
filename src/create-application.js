import { Worker } from 'worker_threads';
import Koa from 'koa';
import logger from 'koa-logger';
import session from 'koa-session';
import cors from '@koa/cors';
import { Db } from 'mongodb';
import { ENVIRONMENT_DEVELOPMENT } from './consts/environments';
import Config from './config/config';

import AuthApi from './api/auth';
import UserApi from './api/user';

import UserDao from './dao/user';
import DeviationsDao from './dao/deviations';
import DeviationsMetadataDao from './dao/deviations-metadata';

import AuthLogic from './logic/auth';
import UserLogic from './logic/user';
import DeviationsLogic from './logic/deviations';

import errorHandler from './routes/error-handler';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import deviationsRoutes from './routes/deviations';
import devSessionMiddleware from './dev-session';

import { outputError } from './helper';

/**
 * @description
 * Creates app instance and binds it to the MongoDB and DeviantArt API.
 *
 * @param {Db} db - The MongoDB database.
 * @param {Worker} schedulerWorker - The task scheduler worker thread.
 * @param {Config} config - The config.
 * @returns {Koa} Application.
 */
export default (db, schedulerWorker, config) => {
  try {
    const app = new Koa();
    app.use(logger());

    app.keys = [config.serverConfig.cookieKey];
    app.use(session({
      renew: true,
    }, app));

    if (config.environment === ENVIRONMENT_DEVELOPMENT) {
      app.use(cors({
        credentials: true,
      }));

      devSessionMiddleware(app);
    }

    app.use(errorHandler);

    const authApi = new AuthApi(config);
    const userApi = new UserApi(config);

    const userDao = new UserDao(db);
    const deviationsDao = new DeviationsDao(db);
    const deviationsMetadataDao = new DeviationsMetadataDao(db);

    const authLogic = new AuthLogic(authApi, userApi, userDao, config);
    const userLogic = new UserLogic(userApi, userDao, schedulerWorker, config);
    const deviationsLogic = new DeviationsLogic(
      userDao,
      deviationsDao,
      deviationsMetadataDao,
      config,
    );

    authRoutes(authLogic, config, app);
    userRoutes(userLogic, app);
    deviationsRoutes(deviationsLogic, app);

    return app;
  } catch (error) {
    outputError(error);

    throw error;
  }
};
