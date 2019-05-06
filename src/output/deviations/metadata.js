import DeviationMetadataModel from '../../models/deviation-metadata/deviation-metadata';

/**
 * Class to prepare output for 'deviations/metadata' route.
 */
export default class DeviationsMetadataOutput {
  /**
   * @description
   * Prepares DeviationMetadataModel objects to output for client.
   *
   * @param {DeviationMetadataModel[]} metadata - Instances of DeviationMetadataModel.
   * @returns {Object} Object for client.
   */
  static prepareOutput(metadata) {
    return {
      metadata: metadata.map(dm => ({
        deviationId: dm.deviationId,
        timestamp: dm.timestamp,
        views: dm.views,
        comments: dm.comments,
        favourites: dm.favourites,
        downloads: dm.downloads,
      })),
    };
  }
}
