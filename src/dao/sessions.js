import { Db } from 'mongodb';
import { COLLECTION_SESSIONS } from '../consts/collections';
import SessionModel from '../models/session/session';
import SessionModelConverter from '../models/session/converter';

/**
 * Sessions DAO class.
 */
export default class SessionsDao {
  /**
   * @description
   * The constructor.
   *
   * @param {Db} db - The database.
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * @description
   * Gets session by ID.
   *
   * @param {string} id - The session ID.
   * @returns {SessionModel} Session fields.
   */
  async getById(id) {
    const session = await this.db.collection(COLLECTION_SESSIONS).findOne({ _id: id });

    return session ? SessionModelConverter.fromDbObject(session) : null;
  }

  /**
   * @description
   * Sets session values by ID.
   *
   * @param {string} id - The session ID.
   * @param {SessionModel} session - The session object.
   */
  async setValuesById(id, session) {
    await this.db.collection(COLLECTION_SESSIONS).updateOne(
      { _id: id },
      { $set: SessionModelConverter.valuesToDbObject(session) },
      { upsert: true },
    );
  }

  /**
   * @description
   * Sets session user data by ID.
   *
   * @param {string} id - The session ID.
   * @param {SessionModel} session - The session object.
   */
  async setUserDataById(id, session) {
    await this.db.collection(COLLECTION_SESSIONS).updateOne(
      { _id: id },
      { $set: SessionModelConverter.userDataToDbObject(session) },
    );
  }

  /**
   * @description
   * Destroys session by ID.
   *
   * @param {string} id - The session ID.
   */
  async destroy(id) {
    await this.db.collection(COLLECTION_SESSIONS).deleteOne({ _id: id });
  }
}
