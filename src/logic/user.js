import UserInfoOutput from '../output/user/info';
import UserApi from '../api/user';
import UserDao from '../dao/user';
import { fetchUserInfoAndCheckRefreshToken } from '../helper';

/**
 * Logic for user part.
 */
export default class UserLogic {
  /**
   * @description
   * The constructor.
   *
   * @param {UserApi} userApi - DeviantArt user API.
   * @param {UserDao} userDao - User DAO.
   */
  constructor(userApi, userDao) {
    this.userApi = userApi;
    this.userDao = userDao;
  }

  /**
   * @description
   * Returns user info for client.
   *
   * @param {string} userId - The user id.
   * @returns {Object} UserInfo instance.
   */
  async getInfo(userId) {
    const userInfo = await fetchUserInfoAndCheckRefreshToken(userId, this.userDao);

    return UserInfoOutput.prepareOutput(userInfo);
  }
}
