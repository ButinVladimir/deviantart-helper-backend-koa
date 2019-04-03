import Koa from 'koa';
import Router, { Joi } from 'koa-joi-router';
import DeviationsBrowseFilter from '../filter/deviations/browse';
import DeviationsDetailsFilter from '../filter/deviations/details';
import * as sort from '../consts/sort';
import refreshAuthGuard from './refresh-auth-guard';
import * as routes from '../consts/routes';
import DeviationsLogic from '../logic/deviations';

/**
 * @description
 * Adds middlewares to app and router to support deviations logic.
 *
 * @param {DeviationsLogic} deviationsLogic - The deviations logic object.
 * @param {Koa} app - The app.
 */
export default (deviationsLogic, app) => {
  const router = Router();

  // /deviations/load
  router.get(routes.DEVIATIONS_LOAD,
    refreshAuthGuard,
    async (ctx) => {
      try {
        await deviationsLogic.startLoadDeviationsTask(ctx.session.userId);

        ctx.body = 'Task has been created';
      } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.throw(e.status || 500);
      }
    });

  // /deviations/browse/:page
  router.get(routes.DEVIATIONS_BROWSE,
    {
      validate: {
        params: {
          page: Joi.number().integer().min(0).required(),
        },
        query: {
          publishedtimebegin: Joi
            .number()
            .integer()
            .positive(),
          publishedtimeend: Joi
            .number()
            .integer()
            .positive(),
          title: Joi
            .string(),
          sortfield: Joi
            .string()
            .valid(
              sort.FIELD_PUBLISHED_TIME,
              sort.FIELD_TITLE,
              sort.FIELD_VIEWS,
              sort.FIELD_COMMENTS,
              sort.FIELD_FAVOURITES,
              sort.FIELD_DOWNLOADS,
            )
            .default(sort.FIELD_PUBLISHED_TIME),
          sortorder: Joi
            .number()
            .valid(sort.ORDER_ASC, sort.ORDER_DESC)
            .default(sort.ORDER_DESC),
        },
      },
    },
    refreshAuthGuard,
    async (ctx) => {
      try {
        const filter = new DeviationsBrowseFilter();
        filter.publishedTimeBegin = ctx.query.publishedtimebegin || null;
        filter.publishedTimeEnd = ctx.query.publishedtimeend || null;
        filter.title = ctx.query.title || null;
        filter.sortField = ctx.query.sortfield;
        filter.sortOrder = ctx.query.sortorder;

        ctx.body = await deviationsLogic.browse(
          ctx.session.userId,
          filter,
          ctx.params.page,
        );
      } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.throw(e.status || 500);
      }
    });

  // /deviations/details/:id
  router.get(routes.DEVIATIONS_DETAILS,
    {
      validate: {
        params: {
          id: Joi
            .string()
            .required(),
        },
        query: {
          timestampbegin: Joi
            .number()
            .integer()
            .positive(),
          timestampend: Joi
            .number()
            .integer()
            .positive(),
        },
      },
    },
    refreshAuthGuard,
    async (ctx) => {
      try {
        const filter = new DeviationsDetailsFilter();
        filter.timestampBegin = ctx.query.timestampbegin || null;
        filter.timestampEnd = ctx.query.timestampend || null;

        const output = await deviationsLogic.details(
          ctx.session.userId,
          ctx.params.id,
          filter,
        );

        if (output === null) {
          ctx.throw(404);
        }

        ctx.body = output;
      } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.throw(e.status || 500);
      }
    });

  router.prefix(routes.DEVIATIONS_PREFIX);
  app.use(router.middleware());
};
