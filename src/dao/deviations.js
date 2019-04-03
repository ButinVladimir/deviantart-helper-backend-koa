import { Db } from 'mongodb';
import { COLLECTION_DEVIATIONS } from '../consts/collections';
import DeviationModel from '../models/deviation/deviation';
import DeviationModelConverter from '../models/deviation/converter';
import DeviationsBrowseFilter from '../filter/deviations/browse';

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
   * Batch update of deviations metada.
   *
   * @param {DeviationModel[]} deviations - Array of Deviation instances.
   * @returns {undefined} Nothing.
   */
  async batchUpdateMetadata(deviations) {
    const operations = deviations.map(d => ({
      updateOne: {
        filter: { _id: d.id },
        update: { $set: DeviationModelConverter.toDbMetadataObject(d) },
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
   * Fetches deviations thumbnails by user ID.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsBrowseFilter} filter - The filter.
   * @param {number} offset - The offset.
   * @param {number} limit - The limit.
   * @returns {DeviationModel[]} Fetched deviations with thumbnails.
   */
  async getThumbnailsByUser(userId, filter, offset, limit) {
    const query = DeviationsDao.prepareThumbnailsQuery(userId, filter);

    const dbObjects = await this.db.collection(COLLECTION_DEVIATIONS)
      .find(
        query,
        {
          skip: offset,
          limit,
          sort: { [filter.sortField]: filter.sortOrder },
          projection: {
            preview: 0,
            userId: 0,
          },
        },
      )
      .toArray();

    return dbObjects.map(d => DeviationModelConverter.fromDbObject(d));
  }

  /**
   * @description
   * Fetches deviation by user ID and deviation ID.
   *
   * @param {string} userId - The user ID.
   * @param {string} deviationId - The deviation ID.
   * @returns {DeviationModel} Fetched deviation.
   */
  async getByIdAndUser(userId, deviationId) {
    const query = {
      userId,
      _id: deviationId,
    };

    const dbObject = await this.db.collection(COLLECTION_DEVIATIONS)
      .findOne(
        query,
        {
          projection: {
            _id: 0,
            thumbnail: 0,
            userId: 0,
          },
        },
      );

    return dbObject
      ? DeviationModelConverter.fromDbObject(dbObject)
      : null;
  }

  /**
   * @description
   * Fetches deviations count by user ID.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsBrowseFilter} filter - The filter.
   * @returns {Promise<number>} Count of deviations of user.
   */
  async getCountByUser(userId, filter) {
    const query = DeviationsDao.prepareThumbnailsQuery(userId, filter);

    return this.db.collection(COLLECTION_DEVIATIONS).countDocuments(query);
  }

  /**
   * @description
   * Prepares query to get deviations thumbnails.
   *
   * @param {string} userId  - The user ID.
   * @param {DeviationsBrowseFilter} filter - The filter.
   * @returns {Object} Count of deviations of user.
   */
  static prepareThumbnailsQuery(userId, filter) {
    const query = { userId };

    if (filter.publishedTimeBegin || filter.publishedTimeEnd) {
      query.publishedTime = {};
    }

    if (filter.publishedTimeBegin) {
      query.publishedTime.$gte = filter.publishedTimeBegin;
    }

    if (filter.publishedTimeEnd) {
      query.publishedTime.$lte = filter.publishedTimeEnd;
    }

    if (filter.title) {
      query.title = {
        $regex: filter.title,
        $options: 'i',
      };
    }

    return query;
  }
}
