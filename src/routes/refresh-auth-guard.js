/**
 * @description
 * Auth guard middleware to check that resource is accessable
 * if user can refresh their access token.
 *
 * @param {Object} ctx - Context.
 * @param {Function} next - Callback.
 */
export default async (ctx, next) => {
  if (ctx.session.isLoggedIn && Date.now() < ctx.session.refreshTokenExpires) {
    await next();
  } else {
    ctx.throw(401);
  }
};
