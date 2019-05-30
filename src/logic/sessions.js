import SessionsDao from '../dao/sessions';
import Config from '../config/config';
import SessionModel from '../models/session/session';

/**
 * Logic for session part.
 */
export default class SessionsLogic {
  /**
   * @description
   * The constructor.
   *
   * @param {SessionsDao} sessionsDao - Sessions DAO.
   * @param {Config} config - Config.
   */
  constructor(sessionsDao, config) {
    this.sessionsDao = sessionsDao;
    this.config = config;
  }

  /**
   * @description
   * Creates session store.
   *
   * @returns {Object} Session store.
   */
  createStore() {
    return {
      get: this.getSession.bind(this),
      set: this.setSession.bind(this),
      destroy: this.destroy.bind(this),
    };
  }

  /**
   * @description
   * Gets session by key.
   *
   * @param {string} key - Session key.
   * @returns {Object} Session values.
   */
  async getSession(key) {
    let sessionModel = await this.sessionsDao.getById(key);
    if (sessionModel === null) {
      sessionModel = new SessionModel();
    }

    // Adding access to internal properties.
    const sessionValues = Object.assign({}, sessionModel.values);
    sessionValues.sessionId = key;
    sessionValues.userId = sessionModel.userId;
    sessionValues.state = sessionModel.state;

    return sessionValues;
  }

  /**
   * @description
   * Sets session by key.
   *
   * @param {string} key - Session key.
   * @param {Object} sessionValues - Session values.
   */
  async setSession(key, sessionValues) {
    const sessionModel = new SessionModel();
    if (sessionValues) {
      Object.assign(sessionModel.values, sessionValues);
    }

    // Session ID shouldn't be saved.
    delete sessionModel.values.sessionId;
    // Data prone to change outside session shouldn't be saved.
    // Update session state explicitly.
    delete sessionModel.values.userId;
    delete sessionModel.values.state;

    await this.sessionsDao.setValuesById(key, sessionModel);
  }

  /**
   * @description
   * Destroys session by key.
   *
   * @param {string} key - The session key.
   */
  async destroy(key) {
    await this.sessionsDao.destroy(key);
  }
}
