import Koa from 'koa';
import Router from 'koa-joi-router';
import authGuard from './auth-guard';
import * as routes from '../consts/routes';
import { NOT_LOGGINED } from '../consts/user-states';
import UserLogic from '../logic/user';

/**
 * @description
 * Adds middlewares to app and router to support user logic.
 *
 * @param {UserLogic} userLogic - The user logic object.
 * @param {Koa} app - The app.
 */
export default (userLogic, app) => {
  const router = Router();

  // /user/info
  router.get(routes.USER_INFO, async (ctx) => {
    if (ctx.session.state === NOT_LOGGINED) {
      ctx.throw(401);
    }

    ctx.response.body = await userLogic.getInfo(ctx.session.userId, ctx.session.state);
  });

  // /user/load
  router.get(routes.USER_LOAD,
    authGuard,
    async (ctx) => {
      const status = await userLogic.startFetchDataTask(ctx.session.userId);

      ctx.response.body = { status };
    });

  router.prefix(routes.USER_PREFIX);
  app.use(router.middleware());
};
