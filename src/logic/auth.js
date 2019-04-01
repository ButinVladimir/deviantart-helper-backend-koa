import UserInfoModel from '../models/user-info/user-info';
import UserInfoModelConverter from '../models/user-info/converter';
import AuthApi from '../api/auth';
import UserApi from '../api/user';
import UserDao from '../dao/user';
import Config from '../config/config';
import { fetchUserInfoAndCheckRefreshToken } from '../helper';

/**
 * Logic for auth part.
 */
export default class AuthLogic {
  /**
   * @description
   * The constructor.
   *
   * @param {AuthApi} authApi - DeviantArt auth API.
   * @param {UserApi} userApi - DeviantArt user API.
   * @param {UserDao} userDao - User DAO.
   * @param {Config} config - Config.
   */
  constructor(authApi, userApi, userDao, config) {
    this.authApi = authApi;
    this.userApi = userApi;
    this.userDao = userDao;
    this.config = config;
  }

  /**
   * @description
   * Callback for authentication.
   *
   * @param {Object} grantResponse - Response from grant.
   * @returns {Object} Session data object.
   */
  async authCallback(grantResponse) {
    const userInfo = new UserInfoModel();
    userInfo.addAuthData(grantResponse, this.config);
    userInfo.addWhoAmIData(await this.userApi.whoAmI(userInfo.accessToken));

    await this.userDao.update(userInfo);

    return UserInfoModelConverter.toSessionData(userInfo);
  }

  /**
   * @description
   * Revokes user session.
   *
   * @param {string} userId - The user id.
   * @returns {boolean} Success of operation.
   */
  async revoke(userId) {
    const userInfo = await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);
    const result = await this.authApi.revoke(userInfo.refreshToken);

    if (result) {
      await this.userDao.update(userInfo.revoke());

      return true;
    }

    return false;
  }

  /**
   * @description
   * Refreshes user session.
   *
   * @param {string} userId - The user id.
   * @returns {Object} Session data object.
   */
  async refresh(userId) {
    const userInfo = await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    userInfo.addRefreshmentData(
      await this.authApi.refresh(
        this.config.oauthConfig.key,
        this.config.oauthConfig.secret,
        userInfo.refreshToken,
      ),
      this.config,
    );

    await this.userDao.update(userInfo);

    return UserInfoModelConverter.toSessionData(userInfo);
  }
}
