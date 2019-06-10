import DeviationMetadataModel from './deviation-metadata';

/**
 * Class to convert object from and into the DeviationMetadataModel objects.
 */
export default class DeviationMetadataModelConverter {
  /**
   * @description
   * Converts API object to DeviationMetadataModel.
   *
   * @param {Object} apiObject - Object from API.
   * @returns {DeviationMetadataModel} - DeviationMetadataModel instance.
   */
  static fromApiObject(apiObject) {
    const deviationMetadata = new DeviationMetadataModel();

    deviationMetadata.deviationId = apiObject.deviationid;
    deviationMetadata.timestamp = Date.now();
    deviationMetadata.description = apiObject.description;
    deviationMetadata.views = apiObject.stats.views;
    deviationMetadata.comments = apiObject.stats.comments;
    deviationMetadata.favourites = apiObject.stats.favourites;
    deviationMetadata.downloads = apiObject.stats.downloads;

    return deviationMetadata;
  }

  /**
   * @description
   * Converts DeviationMetadataModel to DB object.
   *
   * @param {DeviationMetadataModel} deviationModel - DeviationMetadataModel instance.
   * @returns {Object} DB object.
   */
  static toDbObject(deviationModel) {
    return {
      eid: deviationModel.deviationId,
      uid: deviationModel.userId,
      ts: deviationModel.timestamp,
      v: deviationModel.views,
      c: deviationModel.comments,
      f: deviationModel.favourites,
      d: deviationModel.downloads,
    };
  }

  /**
   * @description
   * Converts DB object to DeviationMetadataModel.
   *
   * @param {Object} dbObject - DB object.
   * @returns {DeviationMetadataModel} DeviationMetadataModel instance.
   */
  static fromDbObject(dbObject) {
    const deviationMetadata = new DeviationMetadataModel();

    deviationMetadata.deviationId = dbObject.eid;
    deviationMetadata.userId = dbObject.uid;
    deviationMetadata.timestamp = dbObject.ts;
    deviationMetadata.views = dbObject.v;
    deviationMetadata.comments = dbObject.c;
    deviationMetadata.favourites = dbObject.f;
    deviationMetadata.downloads = dbObject.d;

    return deviationMetadata;
  }
}
