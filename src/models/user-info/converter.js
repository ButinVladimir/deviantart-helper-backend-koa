import UserInfoModel from './user-info';
import UserInfoTokenModel from './token';

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
      accessToken: UserInfoModelConverter.tokenToDbObject(userInfo.accessToken),
      refreshToken: UserInfoModelConverter.tokenToDbObject(userInfo.refreshToken),
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

    userInfo.accessToken = UserInfoModelConverter.tokenFromDbObject(dbObject.accessToken);
    userInfo.refreshToken = UserInfoModelConverter.tokenFromDbObject(dbObject.refreshToken);
    // eslint-disable-next-line no-underscore-dangle
    userInfo.userId = dbObject._id;
    userInfo.userName = dbObject.userName;
    userInfo.userIcon = dbObject.userIcon;
    userInfo.userType = dbObject.userType;
    userInfo.fetchDateThreshold = dbObject.fetchDateThreshold || null;
    userInfo.requestDateThreshold = dbObject.requestDateThreshold || null;

    return userInfo;
  }

  /**
   * @description
   * Converts token to DB object.
   *
   * @param {UserInfoTokenModel} token - The token model.
   * @returns {Object} DB object.
   */
  static tokenToDbObject(token) {
    if (token === null) {
      return null;
    }

    return {
      token: token.token,
      expires: token.expires,
      iv: token.iv,
      authTag: token.authTag,
      salt: token.salt,
    };
  }

  /**
   * @description
   * Converts token to DB object.
   *
   * @param {Object} dbObject - The DB object.
   * @returns {UserInfoTokenModel} The token model.
   */
  static tokenFromDbObject(dbObject) {
    if (dbObject === null) {
      return null;
    }

    const token = new UserInfoTokenModel();
    token.token = dbObject.token;
    token.expires = dbObject.expires;
    token.iv = dbObject.iv;
    token.authTag = dbObject.authTag;
    token.salt = dbObject.salt;

    return token;
  }
}
