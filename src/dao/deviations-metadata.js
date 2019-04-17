import { Db } from 'mongodb';
import { COLLECTION_DEVIATIONS_METADATA } from '../consts/collections';
import DeviationMetadataModel from '../models/deviation-metadata/deviation-metadata';
import DeviationMetadataModelConverter from '../models/deviation-metadata/converter';
import DeviationsDetailsInput from '../input/deviations/details';
import DeviationsStatisticsInput from '../input/deviations/statistics';

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
   * @param {DeviationsDetailsInput} input - The input.
   * @returns {DeviationMetadataModel[]} Fetched deviation.
   */
  async getByIdAndUser(userId, deviationId, input) {
    const query = DeviationsMetadataDao.prepareDetailsQuery(userId, deviationId, input);

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
   * Fetches deviation metadata by user ID and deviation IDs.
   * Optionally can filter found data.
   *
   * @param {string} userId - The user ID.
   * @param {string[]} deviationIds - The deviation ID.
   * @param {DeviationsDetailsInput} input - The input.
   * @returns {DeviationMetadataModel[]} Fetched deviation.
   */
  async getByIdsAndUser(userId, deviationIds, input) {
    const query = DeviationsMetadataDao.prepareStatisticsQuery(userId, deviationIds, input);

    const dbObjects = await this.db.collection(COLLECTION_DEVIATIONS_METADATA).find(
      query,
      {
        sort: { timestamp: 1 },
        projection: {
          _id: 0,
          userId: 0,
        },
      },
    ).toArray();

    return dbObjects.map(dm => DeviationMetadataModelConverter.fromDbObject(dm));
  }

  /**
   * @description
   * Prepares query to fetch deviations metadata by user ID and deviation ID.
   *
   * @param {string} userId  - The user ID.
   * @param {string} deviationId - The deviation ID.
   * @param {DeviationsDetailsInput} input - The input.
   * @returns {Object} The query.
   */
  static prepareDetailsQuery(userId, deviationId, input) {
    const query = { userId, deviationId };

    if (input.timestampBegin || input.timestampEnd) {
      query.timestamp = {};
    }

    if (input.timestampBegin) {
      query.timestamp.$gte = input.timestampBegin;
    }

    if (input.timestampEnd) {
      query.timestamp.$lte = input.timestampEnd;
    }

    return query;
  }

  /**
   * @description
   * Prepares query to fetch deviations metadata by user ID and deviation ID.
   *
   * @param {string} userId  - The user ID.
   * @param {string[]} deviationIds - The deviation IDs.
   * @param {DeviationsStatisticsInput} input - The input.
   * @returns {Object} The query.
   */
  static prepareStatisticsQuery(userId, deviationIds, input) {
    const query = {
      userId,
      deviationId: {
        $in: deviationIds,
      },
    };

    if (input.timestampBegin || input.timestampEnd) {
      query.timestamp = {};
    }

    if (input.timestampBegin) {
      query.timestamp.$gte = input.timestampBegin;
    }

    if (input.timestampEnd) {
      query.timestamp.$lte = input.timestampEnd;
    }

    return query;
  }
}
