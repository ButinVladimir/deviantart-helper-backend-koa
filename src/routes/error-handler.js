import { outputError } from '../helper';

/**
 * @description
 * Error handler middleware.
 *
 * @param {Object} ctx - Context.
 * @param {Function} next - Callback.
 */
export default async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    outputError(e.message);
    outputError(e.stack);
    ctx.throw(e.status || 500);
  }
};
