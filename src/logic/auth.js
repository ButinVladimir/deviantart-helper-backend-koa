import { Worker } from 'worker_threads';
import AuthApi from '../api/auth';
import SessionsDao from '../dao/sessions';
import UserDao from '../dao/user';
import Config from '../config/config';
import SessionModel from '../models/session/session';
import LoadUserInfoTaskModelFactory from '../models/task/factories/load-user-info-factory';
import { FETCHING_INFO } from '../consts/user-states';

/**
 * Logic for auth part.
 */
export default class AuthLogic {
  /**
   * @description
   * The constructor.
   *
   * @param {AuthApi} authApi - DeviantArt auth API.
   * @param {SessionsDao} sessionsDao - Sessions DAO.
   * @param {UserDao} userDao - User DAO.
   * @param {Worker} schedulerWorker - The task scheduler worker thread.
   * @param {Config} config - Config.
   */
  constructor(authApi, sessionsDao, userDao, schedulerWorker, config) {
    this.authApi = authApi;
    this.sessionsDao = sessionsDao;
    this.userDao = userDao;
    this.schedulerWorker = schedulerWorker;
    this.config = config;
  }

  /**
   * @description
   * Callback for authentication.
   *
   * @param {string} sessionId - The session ID.
   * @param {Object} grantResponse - Encrypted response from grant.
   */
  async authCallback(sessionId, grantResponse) {
    const session = new SessionModel();
    session.state = FETCHING_INFO;
    await this.sessionsDao.setUserDataById(sessionId, session);

    this.schedulerWorker.postMessage(
      LoadUserInfoTaskModelFactory.createModel(
        sessionId,
        grantResponse.accessToken,
        grantResponse.refreshToken,
      ),
    );
  }

  /**
   * @description
   * Revokes user session.
   *
   * @param {string} userId - The user id.
   * @returns {boolean} Success of operation.
   */
  async revoke(userId) {
    const userInfo = await this.userDao.getById(userId);
    const result = await this.authApi.revoke(userInfo);

    if (result) {
      await this.userDao.update(userInfo.revoke());

      return true;
    }

    return false;
  }
}
