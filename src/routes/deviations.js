import Koa from 'koa';
import Router, { Joi } from 'koa-joi-router';
import DeviationsBrowseInput from '../input/deviations/browse';
import DeviationsDetailsInput from '../input/deviations/details';
import DeviationsMetadataInput from '../input/deviations/metadata';
import DeviationsStatisticsInput from '../input/deviations/statistics';
import DeviationsTotalInput from '../input/deviations/total';
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

  // /deviations/browse/:page
  router.post(routes.DEVIATIONS_BROWSE,
    {
      validate: {
        params: {
          page: Joi.number().integer().min(0).required(),
        },
        type: 'json',
        body: {
          ids: Joi
            .array()
            .items(Joi.string()),
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
          nsfw: Joi
            .bool()
            .default(null),
        },
      },
    },
    refreshAuthGuard,
    async (ctx) => {
      const input = new DeviationsBrowseInput();
      input.deviationIds = ctx.request.body.ids || null;
      input.publishedTimeBegin = ctx.request.body.publishedtimebegin || null;
      input.publishedTimeEnd = ctx.request.body.publishedtimeend || null;
      input.title = ctx.request.body.title || null;
      input.sortField = ctx.request.body.sortfield;
      input.sortOrder = ctx.request.body.sortorder;
      if (ctx.request.body.nsfw !== null) {
        input.nsfw = ctx.request.body.nsfw;
      }

      ctx.response.body = await deviationsLogic.browse(
        ctx.session.userId,
        input,
        ctx.params.page,
      );
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
          metadata: Joi
            .bool()
            .default(false),
        },
      },
    },
    refreshAuthGuard,
    async (ctx) => {
      const input = new DeviationsDetailsInput();
      input.timestampBegin = ctx.query.timestampbegin || null;
      input.timestampEnd = ctx.query.timestampend || null;
      input.metadata = ctx.query.metadata || false;

      const output = await deviationsLogic.details(
        ctx.session.userId,
        ctx.params.id,
        input,
      );

      if (output === null) {
        ctx.throw(404);
      }

      ctx.response.body = output;
    });

  // /deviations/metadata
  router.post(routes.DEVIATIONS_METADATA,
    {
      validate: {
        type: 'json',
        body: {
          ids: Joi
            .array()
            .items(Joi.string()),
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
      const input = new DeviationsMetadataInput();
      input.deviationIds = ctx.request.body.ids || [];
      input.timestampBegin = ctx.request.body.timestampbegin || null;
      input.timestampEnd = ctx.request.body.timestampend || null;

      const output = await deviationsLogic.metadata(
        ctx.session.userId,
        input,
      );

      ctx.response.body = output;
    });

  // /deviations/statistics/:page
  router.post(routes.DEVIATIONS_STATISTICS,
    {
      validate: {
        params: {
          page: Joi.number().integer().min(0).required(),
        },
        type: 'json',
        body: {
          ids: Joi
            .array()
            .items(Joi.string()),
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
            .default(sort.FIELD_VIEWS),
          sortorder: Joi
            .number()
            .valid(sort.ORDER_ASC, sort.ORDER_DESC)
            .default(sort.ORDER_DESC),
          timestampbegin: Joi
            .number()
            .integer()
            .positive(),
          timestampend: Joi
            .number()
            .integer()
            .positive(),
          nsfw: Joi
            .bool()
            .default(null),
          metadata: Joi
            .bool()
            .default(false),
        },
      },
    },
    refreshAuthGuard,
    async (ctx) => {
      const input = new DeviationsStatisticsInput();
      input.deviationIds = ctx.request.body.ids || null;
      input.publishedTimeBegin = ctx.request.body.publishedtimebegin || null;
      input.publishedTimeEnd = ctx.request.body.publishedtimeend || null;
      input.title = ctx.request.body.title || null;
      input.sortField = ctx.request.body.sortfield;
      input.sortOrder = ctx.request.body.sortorder;
      input.timestampBegin = ctx.request.body.timestampbegin;
      input.timestampEnd = ctx.request.body.timestampend;
      if (ctx.request.body.nsfw !== null) {
        input.nsfw = ctx.request.body.nsfw;
      }
      input.metadata = ctx.request.body.metadata || false;

      ctx.response.body = await deviationsLogic.statistics(
        ctx.session.userId,
        input,
        ctx.params.page,
      );
    });

  // /deviations/total
  router.get(routes.DEVIATIONS_TOTAL,
    {
      validate: {
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
      const input = new DeviationsTotalInput();
      input.timestampBegin = ctx.query.timestampbegin || null;
      input.timestampEnd = ctx.query.timestampend || null;

      const output = await deviationsLogic.totalStatistics(
        ctx.session.userId,
        input,
      );

      ctx.response.body = output;
    });

  router.prefix(routes.DEVIATIONS_PREFIX);
  app.use(router.middleware());
};
