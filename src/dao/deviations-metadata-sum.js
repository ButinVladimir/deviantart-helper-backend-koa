import { Db } from 'mongodb';
import { COLLECTION_DEVIATIONS_METADATA_SUM } from '../consts/collections';
import DeviationMetadataSumModel from '../models/deviation-metadata-sum/deviation-metadata-sum';
import DeviationMetadataSumConverter from '../models/deviation-metadata-sum/converter';
import DeviationsTotalInput from '../input/deviations/total';

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
   * Inserts metadata sum.
   *
   * @param {DeviationMetadataSumModel} metadataSum - The deviation metadata sum.
   * @returns {string} Inserted ID.
   */
  async insertMetadataSum(metadataSum) {
    const result = await this.db.collection(COLLECTION_DEVIATIONS_METADATA_SUM)
      .insertOne(DeviationMetadataSumConverter.toDbObject(metadataSum));

    return result.insertedId;
  }

  /**
   * @description
   * Updates metadata sum by adding it's stats.
   *
   * @param {DeviationMetadataSumModel} metadataSum - The deviation metadata sum.
   */
  async updateMetadataSum(metadataSum) {
    await this.db.collection(COLLECTION_DEVIATIONS_METADATA_SUM)
      .updateOne(
        {
          _id: metadataSum.id,
          uid: metadataSum.userId,
        },
        {
          $inc: DeviationMetadataSumConverter.toDbObjectStats(metadataSum),
        },
      );
  }

  /**
   * @description
   * Gets latest metadata sum retrieved before timestamp.
   *
   * @param {string} userId - The user ID.
   * @param {number} timestamp - The timestamp.
   * @returns {DeviationMetadataSumModel} Deviation metadata sum.
   */
  async getLatestMetadataSum(userId, timestamp) {
    const query = {
      uid: userId,
    };

    if (timestamp !== null) {
      query.ts = { $lte: timestamp };
    }

    const dbObject = await this.db.collection(COLLECTION_DEVIATIONS_METADATA_SUM)
      .find(query, {
        sort: { ts: -1 },
        limit: 1,
        projection: {
          _id: 0,
          uid: 0,
        },
      })
      .toArray();

    return dbObject !== null && dbObject.length > 0
      ? DeviationMetadataSumConverter.fromDbObject(dbObject[0])
      : null;
  }

  /**
   * @description
   * Fetches deviation metadata sum by user ID.
   * Optionally can filter found data.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsTotalInput} input - The input.
   * @returns {DeviationMetadataSumModel[]} Fetched deviation metadata sum.
   */
  async getByUser(userId, input) {
    const query = {
      uid: userId,
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

    const dbObjects = await this.db.collection(COLLECTION_DEVIATIONS_METADATA_SUM).find(
      query,
      {
        sort: { ts: 1 },
        projection: {
          _id: 0,
          uid: 0,
        },
      },
    ).toArray();

    return dbObjects.map(dms => DeviationMetadataSumConverter.fromDbObject(dms));
  }
}
