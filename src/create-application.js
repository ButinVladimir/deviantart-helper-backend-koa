import { Worker } from 'worker_threads';
import Koa from 'koa';
import logger from 'koa-logger';
import Router from 'koa-router';
import session from 'koa-session';
import cors from '@koa/cors';
import { Db } from 'mongodb';
import { ENVIRONMENT_DEVELOPMENT } from './consts/environments';
import Config from './config/config';

import AuthApi from './api/auth';
import UserApi from './api/user';

import UserDao from './dao/user';
import DeviationsDao from './dao/deviations';

import AuthLogic from './logic/auth';
import UserLogic from './logic/user';
import DeviationsLogic from './logic/deviations';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import deviationsRoutes from './routes/deviations';
import devSessionMiddleware from './dev-session';

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

    const authApi = new AuthApi();
    const userApi = new UserApi();

    const userDao = new UserDao(db);
    const deviationsDao = new DeviationsDao(db);

    const authLogic = new AuthLogic(authApi, userApi, userDao, config);
    const userLogic = new UserLogic(userApi, userDao);
    const deviationsLogic = new DeviationsLogic(userDao, deviationsDao, schedulerWorker, config);

    const router = new Router();
    authRoutes(authLogic, router, config, app);
    userRoutes(userLogic, router);
    deviationsRoutes(deviationsLogic, router);

    app.use(router.routes());
    app.use(router.allowedMethods());

    return app;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
