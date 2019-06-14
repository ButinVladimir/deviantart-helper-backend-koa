import DeviationMetadataModel from '../../models/deviation-metadata/deviation-metadata';

/**
 * Class to prepare output for 'deviations/metadata' route.
 */
export default class DeviationsMetadataOutput {
  /**
  * @description
  * Parses DeviationMetadataModel objects and creates object with metadata.
  *
  * @param {DeviationMetadataModel[]} metadata - Instances of DeviationMetadataModel.
  * @returns {Object} Object with metadata for client.
  */
  static prepareMetadata(metadata) {
    const result = {};

    metadata.forEach((dm) => {
      result[dm.deviationId] = result[dm.deviationId] || [];
      result[dm.deviationId].push([
        dm.timestamp,
        dm.views,
        dm.favourites,
        dm.comments,
        dm.downloads,
      ]);
    });

    return result;
  }

  /**
   * @description
   * Prepares DeviationMetadataModel objects to output for client.
   *
   * @param {DeviationMetadataModel[]} metadata - Instances of DeviationMetadataModel.
   * @returns {Object} Object for client.
   */
  static prepareOutput(metadata) {
    return {
      metadata: DeviationsMetadataOutput.prepareMetadata(metadata),
    };
  }
}
