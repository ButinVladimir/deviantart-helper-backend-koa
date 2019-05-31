import { Db } from 'mongodb';
import { COLLECTION_USERS } from '../consts/collections';
import UserInfoModel from '../models/user-info/user-info';
import UserInfoModelConverter from '../models/user-info/converter';

/**
 * User DAO class.
 */
export default class UserDao {
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
   * Saves user info in DB.
   *
   * @param {UserInfoModel} userInfo - UserInfo instance.
   */
  async update(userInfo) {
    await this.db.collection(COLLECTION_USERS).updateOne(
      { _id: userInfo.userId },
      { $set: UserInfoModelConverter.toDbObject(userInfo) },
      { upsert: true },
    );
  }

  /**
   * @description
   * Fetches user info object by user id.
   *
   * @param {string} userId - The user id.
   * @returns {UserInfoModel} UserInfo instance.
   */
  async getById(userId) {
    const dbObject = await this.db.collection(COLLECTION_USERS).findOne({ _id: userId });

    return dbObject
      ? UserInfoModelConverter.fromDbObject(dbObject)
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

  /**
   * @description
   * Gets ids of users eligible to fetch and refresh their data.
   *
   * @returns {string[]} Users ids.
   */
  async getUserIdsForRefreshing() {
    const users = await this.db.collection(COLLECTION_USERS).find({
      accessToken: { $not: { $eq: null } },
      refreshToken: { $not: { $eq: null } },
      $or: [
        { fetchDateThreshold: { $lte: Date.now() } },
        { fetchDateThreshold: { $exists: false } },
      ],
    }).toArray();

    // eslint-disable-next-line no-underscore-dangle
    return users.map(u => u._id);
  }
}
