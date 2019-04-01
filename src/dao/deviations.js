import { Db } from 'mongodb';
import { COLLECTION_DEVIATIONS } from '../consts/collections';
import DeviationModel from '../models/deviation/deviation';
import DeviationModelConverter from '../models/deviation/converter';

/**
 * Deviations DAO class.
 */
export default class DeviationsDao {
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
   * Batch update of deviations.
   *
   * @param {DeviationModel[]} deviations - Array of Deviation instances.
   * @returns {undefined} Nothing.
   */
  async batchUpdate(deviations) {
    const operations = deviations.map(d => ({
      updateOne: {
        filter: { _id: d.id },
        update: { $set: DeviationModelConverter.toDbObject(d) },
        upsert: true,
      },
    }));

    await this.db.collection(COLLECTION_DEVIATIONS).bulkWrite(
      operations,
      { ordered: false },
    );
  }

  /**
   * @description
   * Fetches loaded deviations by user ID.
   *
   * @param {string} userId - The user ID.
   * @param {number} offset - The offset.
   * @param {number} limit - The limit.
   * @returns {DeviationModel[]} Fetched deviations.
   */
  async getByUser(userId, offset, limit) {
    const dbObjects = await this.db.collection(COLLECTION_DEVIATIONS)
      .find({ userId }, {
        skip: offset,
        limit,
        sort: { publishedTime: -1 },
      })
      .toArray();

    return dbObjects.map(d => DeviationModelConverter.fromDbObject(d));
  }
}
