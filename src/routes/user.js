import Koa from 'koa';
import Router from 'koa-joi-router';
import refreshAuthGuard from './refresh-auth-guard';
import * as routes from '../consts/routes';
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
  router.get(routes.USER_INFO,
    refreshAuthGuard,
    async (ctx) => {
      try {
        ctx.response.body = await userLogic.getInfo(ctx.session.userId);
      } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.throw(e.status || 500);
      }
    });

  // /user/load
  router.get(routes.USER_LOAD,
    refreshAuthGuard,
    async (ctx) => {
      try {
        const status = await userLogic.startFetchDataTask(ctx.session.userId);

        ctx.response.body = { status };
      } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.throw(e.status || 500);
      }
    });

  router.prefix(routes.USER_PREFIX);
  app.use(router.middleware());
};
