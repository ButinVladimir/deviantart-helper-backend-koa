import BaseTaskModelFactory from '../base-factory';
import { LOAD_USER_INFO } from '../../../consts/task-names';
import TaskModel from '../task';

/**
 * @description
 * The factory which creates tasks to load user info from DeviantArt API.
 */
export default class LoadUserInfoTaskModelFactory extends BaseTaskModelFactory {
  /**
   * @override
   * @description
   * Creates TaskModel instance.
   *
   * @param {string} sessionId - The session ID.
   * @param {Object} accessToken - The access token.
   * @param {Object} refreshToken - The refresh token.
   * @returns {TaskModel} TaskModel instance.
   */
  static createModel(sessionId, accessToken, refreshToken) {
    const params = {
      sessionId,
      accessToken,
      refreshToken,
    };

    return super.createModelRaw(LOAD_USER_INFO, params);
  }
}
