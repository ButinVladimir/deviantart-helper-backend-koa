import Config from './config/config';
import { NOT_LOGGINED, FULLY_LOGINNED } from './consts/user-states';
import TokenModelConverter from './models/token/converter';
import UserInfoModel from './models/user-info/user-info';

/**
 * @description
 * Session handler middleware.
 *
 * @param {Config} config - The config.
 * @returns {Function} - The middleware.
 */
export default config => async (ctx, next) => {
  if (ctx.session.isNew) {
    ctx.session.state = NOT_LOGGINED;
    ctx.session.userId = null;
  }

  await next();

  if (ctx.session !== null) {
    // Grant saves tokens unencrypted. To avoid this, response is encrypted manually
    // and grant response will replaced with encrypted tokens.
    if (ctx.session.grant && ctx.session.grant.response) {
      const userInfo = new UserInfoModel();
      await userInfo.setAuthData(ctx.session.grant.response, config);

      ctx.session.grant = {
        accessToken: TokenModelConverter.toDbObject(userInfo.accessToken),
        refreshToken: TokenModelConverter.toDbObject(userInfo.refreshToken),
      };
    }

    // Grant response is saved temporarily until user info is fetched and updated.
    // This is necessary when user decides to log out while his info is being fetched.
    if (ctx.session.state === FULLY_LOGINNED) {
      delete ctx.session.grant;
    }
  }
};
