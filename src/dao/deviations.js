import { Db } from 'mongodb';
import { COLLECTION_DEVIATIONS } from '../consts/collections';
import DeviationModel from '../models/deviation/deviation';
import DeviationModelConverter from '../models/deviation/converter';
import DeviationsBrowseInput from '../input/deviations/browse';
import DeviationsStatisticsInput from '../input/deviations/statistics';

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
   * @param {DeviationsBrowseInput} input - The input.
   * @param {number} offset - The offset.
   * @param {number} limit - The limit.
   * @returns {DeviationModel[]} Fetched deviations with thumbnails.
   */
  async getThumbnailsByUser(userId, input, offset, limit) {
    const query = DeviationsDao.prepareFetchQuery(userId, input);

    const dbObjects = await this.db.collection(COLLECTION_DEVIATIONS)
      .find(
        query,
        {
          skip: offset,
          limit,
          sort: { [input.sortField]: input.sortOrder },
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
   * @param {DeviationsBrowseInput} input - The input.
   * @returns {Promise<number>} Count of deviations of user.
   */
  async getCountByUser(userId, input) {
    const query = DeviationsDao.prepareFetchQuery(userId, input);

    return this.db.collection(COLLECTION_DEVIATIONS).countDocuments(query);
  }

  /**
   * @description
   * Fetches deviations statistics by user ID and input.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsStatisticsInput} input - The input.
   * @param {number} offset - The offset.
   * @param {number} limit - The limit.
   * @returns {Promise<DeviationModel[]>} Count of deviations of user.
   */
  async getStatisticsByUser(userId, input, offset, limit) {
    const query = [
      {
        $match: DeviationsDao.prepareFetchQuery(userId, input),
      },
      ...DeviationsDao.prepareStatisticsBeginDataQuery(input),
      ...DeviationsDao.prepareStatisticsEndDataQuery(input),
      {
        $project: {
          _id: 1,
          title: 1,
          url: 1,
          publishedTime: 1,
          thumbnail: 1,
          views: { $subtract: ['$periodEndData.views', '$periodBeginData.views'] },
          favourites: { $subtract: ['$periodEndData.favourites', '$periodBeginData.favourites'] },
          comments: { $subtract: ['$periodEndData.comments', '$periodBeginData.comments'] },
          downloads: { $subtract: ['$periodEndData.downloads', '$periodBeginData.downloads'] },
        },
      },
      {
        $sort: {
          [input.sortField]: input.sortOrder,
          _id: 1,
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ];

    const dbObjects = await this.db.collection(COLLECTION_DEVIATIONS).aggregate(query).toArray();

    return dbObjects.map(d => DeviationModelConverter.fromDbObject(d));
  }

  /**
   * @description
   * Prepares query to get deviations.
   *
   * @param {string} userId  - The user ID.
   * @param {DeviationsBrowseInput|DeviationsStatisticsInput} input - The input.
   * @returns {Object} The query.
   */
  static prepareFetchQuery(userId, input) {
    const query = { userId };

    if (input.publishedTimeBegin || input.publishedTimeEnd) {
      query.publishedTime = {};
    }

    if (input.publishedTimeBegin) {
      query.publishedTime.$gte = input.publishedTimeBegin;
    }

    if (input.publishedTimeEnd) {
      query.publishedTime.$lte = input.publishedTimeEnd;
    }

    if (input.title) {
      query.title = {
        $regex: input.title,
        $options: 'i',
      };
    }

    return query;
  }

  /**
   * @description
   * Prepares query to fetch data for deviation statistics for the beginning of time period.
   *
   * @param {DeviationsStatisticsInput} input - The input.
   * @returns {Array[]} The query.
   */
  static prepareStatisticsBeginDataQuery(input) {
    if (input.timestampBegin) {
      return [
        {
          $lookup: {
            from: 'deviations_metadata',
            let: { deviationId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$deviationId', '$$deviationId'] },
                      { $lt: ['$timestamp', input.timestampBegin] },
                    ],
                  },
                },
              },
              {
                $sort: {
                  timestamp: -1,
                },
              },
              {
                $project: {
                  timestamp: 1,
                  views: 1,
                  favourites: 1,
                  comments: 1,
                  downloads: 1,
                  _id: 0,
                },
              },
              {
                $limit: 1,
              },
            ],
            as: 'periodBeginData',
          },
        },
        {
          $addFields: {
            periodBeginData: {
              $cond: {
                if: { $gt: [{ $size: '$periodBeginData' }, 0] },
                then: { $arrayElemAt: ['$periodBeginData', 0] },
                else: {
                  views: 0,
                  favourites: 0,
                  comments: 0,
                  downloads: 0,
                },
              },
            },
          },
        },
      ];
    }

    return [
      {
        $addFields: {
          periodBeginData: {
            views: 0,
            favourites: 0,
            comments: 0,
            downloads: 0,
          },
        },
      },
    ];
  }

  /**
   * @description
   * Prepares query to fetch data for deviation statistics for the end of time period.
   *
   * @param {DeviationsStatisticsInput} input - The input.
   * @returns {Array[]} The query.
   */
  static prepareStatisticsEndDataQuery(input) {
    if (input.timestampEnd) {
      return [
        {
          $lookup: {
            from: 'deviations_metadata',
            let: { deviationId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$deviationId', '$$deviationId'] },
                      { $lte: ['$timestamp', input.timestampEnd] },
                    ],
                  },
                },
              },
              {
                $sort: {
                  timestamp: -1,
                },
              },
              {
                $project: {
                  timestamp: 1,
                  views: 1,
                  favourites: 1,
                  comments: 1,
                  downloads: 1,
                  _id: 0,
                },
              },
              {
                $limit: 1,
              },
            ],
            as: 'periodEndData',
          },
        },
        {
          $addFields: {
            periodEndData: {
              $cond: {
                if: { $gt: [{ $size: '$periodEndData' }, 0] },
                then: { $arrayElemAt: ['$periodEndData', 0] },
                else: {
                  views: 0,
                  favourites: 0,
                  comments: 0,
                  downloads: 0,
                },
              },
            },
          },
        },
      ];
    }

    return [
      {
        $addFields: {
          periodEndData: {
            views: '$views',
            favourites: '$favourites',
            comments: '$comments',
            downloads: '$downloads',
          },
        },
      },
    ];
  }
}
