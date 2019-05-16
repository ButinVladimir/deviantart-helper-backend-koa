import chalk from 'chalk';
import UserDao from './dao/user';
import UserInfoModel from './models/user-info/user-info';

/**
 * @description
 * Fetches user info and checks access token.
 *
 * @param {string} userId - The user ID.
 * @param {UserDao} userDao - The user DAO.
 * @returns {UserInfoModel} The user info.
 */
export const fetchUserInfoAndCheckAccessToken = async (userId, userDao) => {
  const userInfo = await userDao.getById(userId);

  if (userInfo !== null
    && userInfo.accessToken !== null
    && Date.now() < userInfo.accessToken.expires) {
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
 * @returns {UserInfoModel} The user info.
 */
export const fetchUserInfoAndCheckRefreshToken = async (userId, userDao) => {
  const userInfo = await userDao.getById(userId);

  if (userInfo !== null
    && userInfo.refreshToken !== null
    && Date.now() < userInfo.refreshToken.expires) {
    return userInfo;
  }

  throw new Error('User not found or refresh token expired.');
};

/**
 * @description
 * Checks if threshold is still valid.
 *
 * @param {number} threshold - The threshold timestamp.
 * @returns {boolean} True, if threshold is not valid anymore.
 */
export const checkThreshold = threshold => threshold === null || threshold <= Date.now();

/**
 * @description
 * Prepends current date to the text message and displays it.
 *
 * @param {string} text - The text.
 */
export const output = (text) => {
  const datePrefix = `[${new Date().toLocaleString()}]`;
  console.log(`${chalk.green(datePrefix)}: ${text}`);
};

/**
 * @description
 * Prepends current date to the error message and displays it.
 *
 * @param {string} text - The text.
 */
export const outputError = (text) => {
  const datePrefix = `[${new Date().toLocaleString()}]`;
  console.log(`${chalk.redBright(datePrefix)}: ${text}`);
};

/**
 * @description
 * Marks important part of text.
 *
 * @param {string} text - Text to be marked.
 * @returns {string} Marked text.
 */
export const mark = text => chalk.yellow.bold(text);
