/**
 * @description
 * Auth guard middleware.
 *
 * @param {Object} ctx - Context.
 * @param {Function} next - Callback.
 */
export default async (ctx, next) => {
  if (ctx.session.isLoggedIn && Date.now() < ctx.session.expires) {
    await next();
  } else {
    ctx.throw(401);
  }
};
