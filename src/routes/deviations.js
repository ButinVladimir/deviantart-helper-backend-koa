import Router from 'koa-router';
import accessAuthGuard from './access-auth-guard';
import * as routes from '../consts/routes';
import DeviationsLogic from '../logic/deviations';

/**
 * @description
 * Adds middlewares to app and router to support deviations logic.
 *
 * @param {DeviationsLogic} deviationsLogic - The deviations logic object.
 * @param {Router} router - Koa router.
 * @param {any} loadTaskCreator - Task creator.
 */
export default (deviationsLogic, router, loadTaskCreator) => {
  router.get(routes.DEVIATIONS_LOAD,
    accessAuthGuard,
    async (ctx) => {
      try {
        await loadTaskCreator({
          userId: ctx.session.userId,
          offset: Number.parseInt(ctx.params.offset, 10),
        }).run();

        ctx.body = 'Loaded';
      } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.throw(500);
      }
    });

  router.get(routes.DEVIATIONS_BROWSE,
    accessAuthGuard,
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
