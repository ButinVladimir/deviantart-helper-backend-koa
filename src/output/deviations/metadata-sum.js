import DeviationMetadataSumModel from '../../models/deviation-metadata-sum/deviation-metadata-sum';

/**
 * Class to prepare output for 'deviations/total-metadata' route.
 */
export default class DeviationsMetadataSumOutput {
  /**
  * @description
  * Prepares DeviationMetadataSumModel objects to output for client.
  *
  * @param {DeviationMetadataSumModel[]} metadataSum - Instances of DeviationMetadataSumModel.
  * @returns {Object} Object with metadata sum for client.
  */
  static prepareOutput(metadataSum) {
    return {
      metadata: metadataSum.map(dms => [
        dms.timestamp,
        dms.views,
        dms.comments,
        dms.favourites,
        dms.downloads,
      ]),
    };
  }
}
