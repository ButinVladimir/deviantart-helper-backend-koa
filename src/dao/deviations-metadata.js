import { Db } from 'mongodb';
import { COLLECTION_DEVIATIONS_METADATA } from '../consts/collections';
import DeviationMetadataModel from '../models/deviation-metadata/deviation-metadata';
import DeviationMetadataModelConverter from '../models/deviation-metadata/converter';
import DeviationsDetailsFilter from '../filter/deviations/details';

/**
 * Deviations metadata DAO class.
 */
export default class DeviationsMetadataDao {
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
   * Batch update of deviations metadata.
   *
   * @param {DeviationMetadataModel[]} deviationsMetadata
   * - Array of DeviationMetadataModel instances.
   * @returns {undefined} Nothing.
   */
  async batchInsert(deviationsMetadata) {
    const operations = deviationsMetadata.map(dm => ({
      insertOne: {
        document: DeviationMetadataModelConverter.toDbObject(dm),
      },
    }));

    await this.db.collection(COLLECTION_DEVIATIONS_METADATA).bulkWrite(
      operations,
      { ordered: false },
    );
  }

  /**
   * @description
   * Fetches deviation metadata by user ID and deviation ID.
   * Optionally can filter found data.
   *
   * @param {string} userId - The user ID.
   * @param {string} deviationId - The deviation ID.
   * @param {DeviationsDetailsFilter} filter - The filter.
   * @returns {DeviationMetadataModel[]} Fetched deviation.
   */
  async getByIdAndUser(userId, deviationId, filter) {
    const query = DeviationsMetadataDao.prepareDetailsQuery(userId, deviationId, filter);

    const dbObjects = await this.db.collection(COLLECTION_DEVIATIONS_METADATA).find(
      query,
      {
        sort: { timestamp: 1 },
        projection: {
          _id: 0,
          deviationId: 0,
          userId: 0,
        },
      },
    ).toArray();

    return dbObjects.map(dm => DeviationMetadataModelConverter.fromDbObject(dm));
  }

  /**
   * @description
   * Fetches deviations count by user ID.
   *
   * @param {string} userId  - The user ID.
   * @param {string} deviationId - The deviation ID.
   * @param {DeviationsDetailsFilter} filter - The filter.
   * @returns {Object} Count of deviations of user.
   */
  static prepareDetailsQuery(userId, deviationId, filter) {
    const query = { userId, deviationId };

    if (filter.timestampBegin || filter.timestampEnd) {
      query.timestamp = {};
    }

    if (filter.timestampBegin) {
      query.timestamp.$gte = filter.timestampBegin;
    }

    if (filter.timestampEnd) {
      query.timestamp.$lte = filter.timestampEnd;
    }

    return query;
  }
}
