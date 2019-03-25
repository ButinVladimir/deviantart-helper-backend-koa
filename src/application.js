import Koa from 'koa';
import logger from 'koa-logger';
import Router from 'koa-router';
import session from 'koa-session';
import cors from '@koa/cors';
import { MongoClient } from 'mongodb';
import { ENVIRONMENT_DEVELOPMENT } from './consts/environments';
import Config from './config/config';
import AuthApi from './api/auth';
import UserApi from './api/user';
import UserDao from './dao/user';
import AuthLogic from './logic/auth';
import UserLogic from './logic/user';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import devSessionMiddleware from './dev-session';

/**
 * @description
 * Creates app instance and binds it to DB and API.
 *
 * @param {Config} config - The config.
 */
export default async (config) => {
  try {
    const dbClient = new MongoClient(config.connectionString, {
      useNewUrlParser: true,
    });
    await dbClient.connect();
    const db = dbClient.db(config.db);

    const app = new Koa();
    app.use(logger());

    app.keys = [config.cookieKey];
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

    const authLogic = new AuthLogic(authApi, userApi, userDao, config);
    const userLogic = new UserLogic(userApi, userDao);

    const router = new Router();
    authRoutes(authLogic, router, config, app);
    userRoutes(userLogic, router);

    app.use(router.routes());
    app.use(router.allowedMethods());

    return app;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
