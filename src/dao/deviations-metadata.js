import { Db } from 'mongodb';
import { COLLECTION_DEVIATIONS_METADATA } from '../consts/collections';
import DeviationMetadataModel from '../models/deviation-metadata/deviation-metadata';
import DeviationMetadataModelConverter from '../models/deviation-metadata/converter';
import DeviationsDetailsInput from '../input/deviations/details';
import DeviationsMetadataInput from '../input/deviations/metadata';
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
   * @returns {DeviationMetadataModel[]} Fetched deviation metadata.
   */
  async getByIdAndUser(userId, deviationId, input) {
    const query = DeviationsMetadataDao.prepareQueryById(userId, deviationId, input);

    const dbObjects = await this.db.collection(COLLECTION_DEVIATIONS_METADATA).find(
      query,
      {
        sort: { ts: 1 },
        projection: {
          _id: 0,
          eid: 0,
          uid: 0,
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
   * @param {DeviationsMetadataInput|DeviationsStatisticsInput} input - The input.
   * @returns {DeviationMetadataModel[]} Fetched deviation metadata.
   */
  async getByIdsAndUser(userId, deviationIds, input) {
    const query = DeviationsMetadataDao.prepareQueryByIds(userId, deviationIds, input);

    const dbObjects = await this.db.collection(COLLECTION_DEVIATIONS_METADATA).find(
      query,
      {
        sort: { ts: 1 },
        projection: {
          _id: 0,
          uid: 0,
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
  static prepareQueryById(userId, deviationId, input) {
    const query = { uid: userId, eid: deviationId };

    if (input.timestampBegin || input.timestampEnd) {
      query.ts = {};
    }

    if (input.timestampBegin) {
      query.ts.$gte = input.timestampBegin;
    }

    if (input.timestampEnd) {
      query.ts.$lte = input.timestampEnd;
    }

    return query;
  }

  /**
   * @description
   * Prepares query to fetch deviations metadata by user ID and deviation IDs.
   *
   * @param {string} userId  - The user ID.
   * @param {string[]} deviationIds - The deviation IDs.
   * @param {DeviationsMetadataInput|DeviationsStatisticsInput} input - The input.
   * @returns {Object} The query.
   */
  static prepareQueryByIds(userId, deviationIds, input) {
    const query = {
      uid: userId,
      eid: {
        $in: deviationIds,
      },
    };

    if (input.timestampBegin || input.timestampEnd) {
      query.ts = {};
    }

    if (input.timestampBegin) {
      query.ts.$gte = input.timestampBegin;
    }

    if (input.timestampEnd) {
      query.ts.$lte = input.timestampEnd;
    }

    return query;
  }
}
