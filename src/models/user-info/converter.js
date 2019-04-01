import UserInfoModel from './user-info';

/**
 * Class to convert object from and into the UserInfoModel objects.
 */
export default class UserInfoModelConverter {
  /**
   * @description
   * Converts UserInfoModel to session data.
   *
   * @param {UserInfoModel} userInfo - UserInfoModel instance.
   * @returns {Object} Session object.
   */
  static toSessionData(userInfo) {
    return {
      userId: userInfo.userId,
      accessTokenExpires: userInfo.accessTokenExpires,
      refreshTokenExpires: userInfo.refreshTokenExpires,
    };
  }

  /**
   * @description
   * Converts UserInfoModel to DB object.
   *
   * @param {UserInfoModel} userInfo - UserInfoModel instance.
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
   * Converts DB object to UserInfoModel.
   *
   * @param {Object} dbObject - DB object.
   * @returns {UserInfoModel} UserInfoModel instance.
   */
  static fromDbObject(dbObject) {
    const userInfo = new UserInfoModel();

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
   * Converts UserInfoModel into object for client.
   *
   * @param {UserInfoModel} userInfo - UserInfoModel instance.
   * @returns {Object} Object for client.
   */
  static toClientObject(userInfo) {
    return {
      accessTokenExpires: userInfo.accessTokenExpires,
      refreshTokenExpires: userInfo.refreshTokenExpires,
      userId: userInfo.userId,
      userName: userInfo.userName,
      userIcon: userInfo.userIcon,
      userType: userInfo.userType,
    };
  }
}
