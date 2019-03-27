/**
 * @description
 * Auth guard middleware to check that resource is accessable.
 *
 * @param {Object} ctx - Context.
 * @param {Function} next - Callback.
 */
export default async (ctx, next) => {
  if (ctx.session.isLoggedIn && Date.now() < ctx.session.accessTokenExpires) {
    await next();
  } else {
    ctx.throw(401);
  }
};
