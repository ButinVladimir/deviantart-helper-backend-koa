import { Worker } from 'worker_threads';
import Koa from 'koa';
import logger from 'koa-logger';
import session from 'koa-session';
import compress from 'koa-compress';
import cors from '@koa/cors';
import { Db } from 'mongodb';
import { RateLimit } from 'koa2-ratelimit';
import serve from 'koa-static';
import { join } from 'path';
import { Z_SYNC_FLUSH } from 'zlib';

import { ENVIRONMENT_DEVELOPMENT } from './consts/environments';
import Config from './config/config';
import sessionHandler from './session-handler';

import AuthApi from './api/auth';

import SessionsDao from './dao/sessions';
import UserDao from './dao/user';
import DeviationsDao from './dao/deviations';
import DeviationsMetadataDao from './dao/deviations-metadata';
import DeviationsMetadataSumDao from './dao/deviations-metadata-sum';

import SessionsLogic from './logic/sessions';
import AuthLogic from './logic/auth';
import UserLogic from './logic/user';
import DeviationsLogic from './logic/deviations';

import errorHandler from './routes/error-handler';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import deviationsRoutes from './routes/deviations';

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

    const limiter = RateLimit.middleware({
      interval: config.rateLimitConfig.interval,
      max: config.rateLimitConfig.max,
      delayAfter: config.rateLimitConfig.delayAfter,
      timeWait: config.rateLimitConfig.timeWait,
    });
    app.use(limiter);

    app.use(compress({
      flush: Z_SYNC_FLUSH,
    }));

    const sessionsDao = new SessionsDao(db);
    const sessionsLogic = new SessionsLogic(sessionsDao, config);
    app.keys = [config.serverConfig.cookieKey];
    app.use(session({
      renew: true,
      store: sessionsLogic.createStore(),
    }, app));

    if (config.environment === ENVIRONMENT_DEVELOPMENT) {
      app.use(cors({
        credentials: true,
      }));
    }

    app.use(errorHandler);
    app.use(sessionHandler(config));

    app.use(serve(
      join(__dirname, '..', '/public'),
      { maxage: config.serverConfig.staticMaxAge },
    ));

    const authApi = new AuthApi(config);

    const userDao = new UserDao(db);
    const deviationsDao = new DeviationsDao(db);
    const deviationsMetadataDao = new DeviationsMetadataDao(db);
    const deviationsMetadataSumDao = new DeviationsMetadataSumDao(db);

    const authLogic = new AuthLogic(authApi, sessionsDao, userDao, schedulerWorker, config);
    const userLogic = new UserLogic(userDao, schedulerWorker, config);
    const deviationsLogic = new DeviationsLogic(
      userDao,
      deviationsDao,
      deviationsMetadataDao,
      deviationsMetadataSumDao,
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
