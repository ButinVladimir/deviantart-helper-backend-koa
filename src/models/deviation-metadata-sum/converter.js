import DeviationMetadataSumModel from './deviation-metadata-sum';

/**
 * Class to convert object from and into the DeviationMetadataSumModel objects.
 */
export default class DeviationMetadataSumModelConverter {
  /**
   * @description
   * Converts DeviationMetadataSumModel to DB object.
   *
   * @param {DeviationMetadataSumModel} deviationMetadataSum - DeviationMetadataSumModel instance.
   * @returns {Object} DB object.
   */
  static toDbObject(deviationMetadataSum) {
    return {
      uid: deviationMetadataSum.userId,
      ts: deviationMetadataSum.timestamp,
      v: deviationMetadataSum.views,
      f: deviationMetadataSum.favourites,
      c: deviationMetadataSum.comments,
      d: deviationMetadataSum.downloads,
    };
  }

  /**
   * @description
   * Converts DeviationMetadataSumModel stats to DB object.
   *
   * @param {DeviationMetadataSumModel} deviationMetadataSum - DeviationMetadataSumModel instance.
   * @returns {Object} DB object.
   */
  static toDbObjectStats(deviationMetadataSum) {
    return {
      v: deviationMetadataSum.views,
      f: deviationMetadataSum.favourites,
      c: deviationMetadataSum.comments,
      d: deviationMetadataSum.downloads,
    };
  }

  /**
   * @description
   * Converts DB object to DeviationMetadataSumModel.
   *
   * @param {Object} dbObject - DB object.
   * @returns {DeviationMetadataSumModel} DeviationMetadataSumModel instance.
   */
  static fromDbObject(dbObject) {
    const deviationMetadataSum = new DeviationMetadataSumModel();

    // eslint-disable-next-line no-underscore-dangle
    deviationMetadataSum.timestamp = dbObject.ts;
    deviationMetadataSum.views = dbObject.v;
    deviationMetadataSum.favourites = dbObject.f;
    deviationMetadataSum.comments = dbObject.c;
    deviationMetadataSum.downloads = dbObject.d;

    return deviationMetadataSum;
  }
}
