import UserInfoConverter from '../models/user-info/converter';
import UserApi from '../api/user';
import UserDao from '../dao/user';

/**
 * Logic for user part.
 */
export default class UserLogic {
  /**
   * @description
   * Constructor.
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
  async getClientInfo(userId) {
    const userInfo = await this.userDao.getById(userId);

    if (userInfo) {
      return UserInfoConverter.toClientObject(userInfo);
    }

    return null;
  }
}
