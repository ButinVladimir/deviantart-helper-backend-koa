import { Db } from 'mongodb';
import { COLLECTION_USERS } from '../consts/collections';
import UserInfo from '../models/user-info/user-info';
import UserInfoConverter from '../models/user-info/converter';

/**
 * User DAO class.
 */
export default class UserDao {
  /**
   * @description
   * Constructor.
   *
   * @param {Db} db - The database.
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * @description
   * Saves user info in DB.
   *
   * @param {UserInfo} userInfo - UserInfo instance.
   */
  async update(userInfo) {
    await this.db.collection(COLLECTION_USERS).updateOne(
      { _id: userInfo.userId },
      { $set: UserInfoConverter.toDbObject(userInfo) },
      { upsert: true },
    );
  }

  /**
   * @description
   * Fetches user info object by user id.
   *
   * @param {string} userId - The user id.
   * @returns {UserInfo} UserInfo instance.
   */
  async getById(userId) {
    const dbObject = await this.db.collection(COLLECTION_USERS).findOne({ _id: userId });

    return dbObject
      ? UserInfoConverter.fromDbObject(dbObject)
      : null;
  }

  /**
   * @description
   * Deletes user info object by user id.
   *
   * @param {string} userId - The user id.
   */
  async deleteById(userId) {
    await this.db.collection(COLLECTION_USERS).deleteOne({ _id: userId });
  }
}
