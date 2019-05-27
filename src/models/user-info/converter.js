import UserInfoModel from './user-info';
import TokenModelConverter from '../token/converter';

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
      accessTokenExpires: userInfo.accessToken !== null ? userInfo.accessToken.expires : null,
      refreshTokenExpires: userInfo.refreshToken !== null ? userInfo.refreshToken.expires : null,
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
    const result = {
      accessToken: TokenModelConverter.toDbObject(userInfo.accessToken),
      refreshToken: TokenModelConverter.toDbObject(userInfo.refreshToken),
      userName: userInfo.userName,
      userIcon: userInfo.userIcon,
      userType: userInfo.userType,
    };

    if (userInfo.fetchDateThreshold !== null) {
      result.fetchDateThreshold = userInfo.fetchDateThreshold;
    }

    if (userInfo.requestDateThreshold !== null) {
      result.requestDateThreshold = userInfo.requestDateThreshold;
    }

    return result;
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

    userInfo.accessToken = TokenModelConverter.fromDbObject(dbObject.accessToken);
    userInfo.refreshToken = TokenModelConverter.fromDbObject(dbObject.refreshToken);
    // eslint-disable-next-line no-underscore-dangle
    userInfo.userId = dbObject._id;
    userInfo.userName = dbObject.userName;
    userInfo.userIcon = dbObject.userIcon;
    userInfo.userType = dbObject.userType;
    userInfo.fetchDateThreshold = dbObject.fetchDateThreshold || null;
    userInfo.requestDateThreshold = dbObject.requestDateThreshold || null;

    return userInfo;
  }
}
