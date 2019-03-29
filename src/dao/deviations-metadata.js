import { Db } from 'mongodb';
import { COLLECTION_DEVIATIONS_METADATA } from '../consts/collections';
import DeviationMetadataModel from '../models/deviation-metadata/deviation-metadata';
import DeviationMetadataModelConverter from '../models/deviation-metadata/converter';

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
}
