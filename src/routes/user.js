import Router from 'koa-router';
import authGuard from './auth-guard';
import * as routes from '../consts/routes';
import UserLogic from '../logic/user';

/**
 * @description
 * Adds middlewares to app and router to support user logic.
 *
 * @param {UserLogic} userLogic - The user logic object.
 * @param {Router} router - Koa router.
 */
export default (userLogic, router) => {
  router.get(routes.USER_INFO,
    authGuard,
    async (ctx) => {
      try {
        ctx.body = await userLogic.getClientInfo(ctx.session.userId);
      } catch (e) {
        console.error(e);
        ctx.throw(500);
      }
    });
};
