import UserDao from './dao/user';
import UserInfo from './models/user-info/user-info';

/**
 * @description
 * Fetches user info and checks access token.
 *
 * @param {string} userId - The user ID.
 * @param {UserDao} userDao - The user DAO.
 * @returns {UserInfo} The user info.
 */
export const fetchUserInfoAndCheckAccessToken = async (userId, userDao) => {
  const userInfo = await userDao.getById(userId);

  if (userInfo && Date.now() < userInfo.accessTokenExpires) {
    return userInfo;
  }

  throw new Error('User not found or access token expired.');
};

/**
 * @description
 * Fetches user info and checks refresh token.
 *
 * @param {string} userId - The user ID.
 * @param {UserDao} userDao - The user DAO.
 * @returns {UserInfo} The user info.
 */
export const fetchUserInfoAndCheckRefreshToken = async (userId, userDao) => {
  const userInfo = await userDao.getById(userId);

  if (userInfo && Date.now() < userInfo.refreshTokenExpires) {
    return userInfo;
  }

  throw new Error('User not found or refresh token expired.');
};
