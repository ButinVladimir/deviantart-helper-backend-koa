import SessionModel from './session';
import { NOT_LOGGINED } from '../../consts/user-states';

/**
 * Class to convert object from and into the SessionModel objects.
 */
export default class SessionModelConverter {
  /**
   * @description
   * Converts session values to DB object.
   *
   * @param {SessionModel} session - The session model.
   * @returns {Object} DB object.
   */
  static valuesToDbObject(session) {
    return {
      values: session.values,
    };
  }

  /**
   * @description
   * Converts session user ID to DB object.
   *
   * @param {SessionModel} session - The session model.
   * @returns {Object} DB object.
   */
  static userDataToDbObject(session) {
    return {
      state: session.state,
      userId: session.userId,
    };
  }

  /**
   * @description
   * Converts session from DB object.
   *
   * @param {Object} dbObject - The DB object.
   * @returns {SessionModel} The session model.
   */
  static fromDbObject(dbObject) {
    const session = new SessionModel();
    session.userId = dbObject.userId || null;
    session.state = dbObject.state || NOT_LOGGINED;
    Object.assign(session.values, dbObject.values);

    return session;
  }
}
