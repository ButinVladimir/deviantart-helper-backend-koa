import Koa from 'koa';
import mount from 'koa-mount';
import grant from 'grant-koa';
import Router from 'koa-joi-router';
import refreshAuthGuard from './refresh-auth-guard';
import * as routes from '../consts/routes';
import Config from '../config/config';
import AuthLogic from '../logic/auth';

/**
 * @description
 * Adds middlewares to app and router to support auth logic.
 *
 * @param {AuthLogic} authLogic - The auth logic object.
 * @param {Config} config - The config.
 * @param {Koa} app - The app.
 */
export default (authLogic, config, app) => {
  const router = Router();

  app.use(mount(routes.AUTH_PREFIX, grant({
    defaults: {
      redirect_uri: config.oauthConfig.redirectUri,
      transport: 'session',
      path: routes.AUTH_PREFIX,
    },
    deviantart: {
      key: config.oauthConfig.key,
      secret: config.oauthConfig.secret,
      scope: ['user', 'browse'],
      callback: `${routes.AUTH_PREFIX}${routes.AUTH_CALLBACK}`,
    },
  })));

  // /auth/callback
  router.get(routes.AUTH_CALLBACK, async (ctx) => {
    if (ctx.session.grant) {
      const session = await authLogic.authCallback(ctx.session.grant.response);
      Object.assign(ctx.session, session);
      ctx.session.isLoggedIn = true;

      delete ctx.session.grant;

      ctx.response.body = 'Granted';
    } else {
      ctx.response.body = 'Callback data is missing';
    }
  });

  // /auth/revoke
  router.get(routes.AUTH_REVOKE,
    refreshAuthGuard,
    async (ctx) => {
      const revokeResult = await authLogic.revoke(ctx.session.userId);

      ctx.response.body = { status: revokeResult ? 'Revoked' : 'Something went wrong' };
      ctx.session = null;
    });

  router.prefix(routes.AUTH_PREFIX);
  app.use(router.middleware());
};
