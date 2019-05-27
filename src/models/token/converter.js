import TokenModel from './token';

/**
 * Class to convert object from and into the TokenModel objects.
 */
export default class TokenModelConverter {
  /**
   * @description
   * Converts token to DB object.
   *
   * @param {TokenModel} token - The token model.
   * @returns {Object} DB object.
   */
  static toDbObject(token) {
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
   * Converts token from DB object.
   *
   * @param {Object} dbObject - The DB object.
   * @returns {TokenModel} The token model.
   */
  static fromDbObject(dbObject) {
    if (dbObject === null) {
      return null;
    }

    const token = new TokenModel();
    token.token = dbObject.token;
    token.expires = dbObject.expires;
    token.iv = dbObject.iv;
    token.authTag = dbObject.authTag;
    token.salt = dbObject.salt;

    return token;
  }
}
