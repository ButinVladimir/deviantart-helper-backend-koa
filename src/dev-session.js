import Koa from 'koa';

/**
 * @description
 * Function to register development session middleware.
 *
 * @param {Koa} app - The application.
 */
export default (app) => {
  let sharedSession = {};

  app.use(async (ctx, next) => {
    Object.assign(ctx.session, sharedSession);

    await next();

    if (ctx.session === null) {
      sharedSession = {};
    } else {
      sharedSession = Object.assign({}, ctx.session);
    }
  });
};
