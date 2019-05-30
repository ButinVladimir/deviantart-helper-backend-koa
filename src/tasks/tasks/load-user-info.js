import BaseTask from '../base';
import AuthApi from '../../api/auth';
import UserApi from '../../api/user';
import UserDao from '../../dao/user';
import SessionsDao from '../../dao/sessions';
import Config from '../../config/config';
import UserInfoModel from '../../models/user-info/user-info';
import SessionModel from '../../models/session/session';
import TokenModelConverter from '../../models/token/converter';
import { FULLY_LOGINNED } from '../../consts/user-states';
import { output, mark } from '../../helper';
import TaskModel from '../../models/task/task';

/**
 * Task to load user info.
 */
export default class LoadUserInfoTask extends BaseTask {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} params - Task parameters.
   * @param {AuthApi} authApi - The auth DeviantArt API.
   * @param {UserApi} userApi - The user DeviantArt API.
   * @param {UserDao} userDao - The user DAO.
   * @param {SessionsDao} sessionsDao - The sessions DAO.
   * @param {Config} config - The config.
   */
  constructor(params, authApi, userApi, userDao, sessionsDao, config) {
    super();

    this.setParams(params);

    this.authApi = authApi;
    this.userApi = userApi;
    this.userDao = userDao;
    this.sessionsDao = sessionsDao;
    this.config = config;
  }

  /**
   * @override
   * @description
   * Sets task parameters.
   *
   * @param {Object} param0 - Object with parameters.
   */
  setParams({ sessionId, accessToken, refreshToken }) {
    this.sessionId = sessionId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  /**
   * @override
   * @description
   * Runs current task.
   *
   * @returns {Promise<TaskModel[]>} Batch of next tasks.
   */
  async run() {
    const userInfo = new UserInfoModel();
    userInfo.accessToken = TokenModelConverter.fromDbObject(this.accessToken);
    userInfo.refreshToken = TokenModelConverter.fromDbObject(this.refreshToken);
    output(`Access token expires ${mark(new Date(userInfo.accessToken.expires).toLocaleString())}`);

    if (Date.now() >= userInfo.accessToken.expires) {
      output('Access token is expired, needs refreshing');
      output(`Refresh token expires ${mark(new Date(userInfo.refreshToken.expires).toLocaleString())}`);

      if (Date.now() >= userInfo.refreshToken.expires) {
        throw new Error('Refresh token has expired');
      }

      await userInfo.setAuthData(
        await this.authApi.refresh(
          this.config.oauthConfig.key,
          this.config.oauthConfig.secret,
          userInfo,
        ),
        this.config,
      );

      output('Tokens have been refreshed');
    }

    output('Getting user info');
    userInfo.setWhoAmIData(await this.userApi.whoAmI(userInfo));
    output(`Got info for user ${mark(userInfo.userName)}`);

    await this.userDao.update(userInfo);

    output(`Updating session ${mark(this.sessionId)}`);

    const session = new SessionModel();
    session.state = FULLY_LOGINNED;
    session.userId = userInfo.userId;
    await this.sessionsDao.setUserDataById(this.sessionId, session);

    return [];
  }
}
