import UserInfo from './user-info';

/**
 * Class to convert object from and into the UserInfo objects.
 */
export default class UserInfoConverter {
  /**
   * @description
   * Converts UserInfo to session data.
   *
   * @param {UserInfo} userInfo - UserInfo instance.
   * @returns {Object} Session object.
   */
  static toSessionData(userInfo) {
    return {
      userId: userInfo.userId,
      expires: userInfo.accessTokenExpires,
    };
  }

  /**
   * @description
   * Converts UserInfo to DB object.
   *
   * @param {UserInfo} userInfo - UserInfo instance.
   * @returns {Object} DB object.
   */
  static toDbObject(userInfo) {
    return {
      accessToken: userInfo.accessToken,
      accessTokenExpires: userInfo.accessTokenExpires,
      refreshToken: userInfo.refreshToken,
      refreshTokenExpires: userInfo.refreshTokenExpires,
      userName: userInfo.userName,
      userIcon: userInfo.userIcon,
      userType: userInfo.userType,
    };
  }

  /**
   * @description
   * Converts DB object to UserInfo.
   *
   * @param {Object} dbObject - DB object.
   * @returns {UserInfo} UserInfo instance.
   */
  static fromDbObject(dbObject) {
    const userInfo = new UserInfo();

    userInfo.accessToken = dbObject.accessToken;
    userInfo.accessTokenExpires = dbObject.accessTokenExpires;
    userInfo.refreshToken = dbObject.refreshToken;
    userInfo.refreshTokenExpires = dbObject.refreshTokenExpires;
    // eslint-disable-next-line no-underscore-dangle
    userInfo.userId = dbObject._id;
    userInfo.userName = dbObject.userName;
    userInfo.userIcon = dbObject.userIcon;
    userInfo.userType = dbObject.userType;

    return userInfo;
  }

  /**
   * @description
   * Converts UserInfo into object for client.
   *
   * @param {UserInfo} userInfo - UserInfo instance.
   * @returns {Object} Object for client.
   */
  static toClientObject(userInfo) {
    return userInfo
      ? {
        accessTokenExpires: userInfo.accessTokenExpires,
        refreshTokenExpires: userInfo.refreshTokenExpires,
        userId: userInfo.userId,
        userName: userInfo.userName,
        userIcon: userInfo.userIcon,
        userType: userInfo.userType,
      }
      : null;
  }
}
