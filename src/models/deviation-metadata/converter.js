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
   * @returns {DeviationMetadataModel} - DeviationMetadataModel object.
   */
  static fromApiObject(apiObject) {
    const deviationMetadata = new DeviationMetadataModel();

    deviationMetadata.deviationId = apiObject.deviationid;
    deviationMetadata.timestamp = Date.now();
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
      deviationId: deviationModel.deviationId,
      timestamp: deviationModel.timestamp,
      views: deviationModel.views,
      comments: deviationModel.comments,
      favourites: deviationModel.favourites,
      downloads: deviationModel.downloads,
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

    deviationMetadata.deviationId = dbObject.deviationId;
    deviationMetadata.timestamp = dbObject.timestamp;
    deviationMetadata.views = dbObject.views;
    deviationMetadata.comments = dbObject.comments;
    deviationMetadata.favourites = dbObject.favourites;
    deviationMetadata.downloads = dbObject.downloads;

    return deviationMetadata;
  }
}
