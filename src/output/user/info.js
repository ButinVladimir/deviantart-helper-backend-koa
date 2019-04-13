import UserInfoModel from '../../models/user-info/user-info';

/**
 * Class to prepare output for 'user/info' route.
 */
export default class UserInfoOutput {
  /**
   * @description
   * Prepares UserInfoModel to output for client.
   *
   * @param {UserInfoModel} userInfo - UserInfoModel instance.
   * @returns {Object} Object for client.
   */
  static prepareOutput(userInfo) {
    return {
      userId: userInfo.userId,
      userName: userInfo.userName,
      userIcon: userInfo.userIcon,
      userType: userInfo.userType,
      accessTokenExpires: userInfo.accessTokenExpires,
      refreshTokenExpires: userInfo.refreshTokenExpires,
    };
  }
}