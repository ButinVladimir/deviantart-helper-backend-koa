import Koa from 'koa';
import mount from 'koa-mount';
import grant from 'grant-koa';
import Router from 'koa-router';
import refreshAuthGuard from './refresh-auth-guard';
import * as routes from '../consts/routes';
import Config from '../config/config';
import AuthLogic from '../logic/auth';

/**
 * @description
 * Adds middlewares to app and router to support auth logic.
 *
 * @param {AuthLogic} authLogic - The auth logic object.
 * @param {Router} router - Koa router.
 * @param {Config} config - The config.
 * @param {Koa} app - The app.
 */
export default (authLogic, router, config, app) => {
  app.use(mount(routes.AUTH_PREFIX, grant({
    defaults: {
      redirect_uri: config.oauthRedirectUri,
      transport: 'session',
      path: routes.AUTH_PREFIX,
    },
    deviantart: {
      key: config.oauthKey,
      secret: config.oauthSecret,
      scope: ['user', 'browse'],
      callback: routes.AUTH_CALLBACK,
    },
  })));

  router.get(routes.AUTH_CALLBACK, async (ctx) => {
    try {
      if (ctx.session.grant) {
        const session = await authLogic.authCallback(ctx.session.grant.response);
        Object.assign(ctx.session, session);
        ctx.session.isLoggedIn = true;

        delete ctx.session.grant;

        ctx.body = 'Granted';
      } else {
        ctx.body = 'Callback data is missing';
      }
    } catch (e) {
      console.error(e.message);
      console.error(e.stack);
      ctx.throw(500);
    }
  });

  router.get(routes.AUTH_REVOKE,
    refreshAuthGuard,
    async (ctx) => {
      try {
        const revokeResult = await authLogic.revoke(ctx.session.userId);

        if (revokeResult) {
          ctx.session = null;
          ctx.body = 'Revoked';
        } else {
          ctx.throw(500);
        }
      } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.throw(500);
      }
    });

  router.get(routes.AUTH_REFRESH,
    refreshAuthGuard,
    async (ctx) => {
      try {
        const session = await authLogic.refresh(ctx.session.userId);
        if (session) {
          Object.assign(ctx.session, session);
          ctx.body = 'Refreshed';
        } else {
          ctx.body = 'Refreshment failed';
        }
      } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.throw(500);
      }
    });
};
