import Router from 'koa-router';
import refreshAuthGuard from './refresh-auth-guard';
import * as routes from '../consts/routes';
import DeviationsLogic from '../logic/deviations';

/**
 * @description
 * Adds middlewares to app and router to support deviations logic.
 *
 * @param {DeviationsLogic} deviationsLogic - The deviations logic object.
 * @param {Router} router - Koa router.
 */
export default (deviationsLogic, router) => {
  router.get(routes.DEVIATIONS_LOAD,
    refreshAuthGuard,
    async (ctx) => {
      try {
        await deviationsLogic.startLoadDeviationsTask(ctx.session.userId);

        ctx.body = 'Task has been created';
      } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.throw(500);
      }
    });

  router.get(routes.DEVIATIONS_BROWSE,
    refreshAuthGuard,
    async (ctx) => {
      try {
        ctx.body = await deviationsLogic.browse(
          ctx.session.userId,
          Number.parseInt(ctx.params.offset, 10),
        );
      } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.throw(500);
      }
    });
};
