import DeviationMetadataSumModel from '../../models/deviation-metadata-sum/deviation-metadata-sum';

/**
 * Class to prepare output for 'deviations/total' route.
 */
export default class DeviationsTotalOutput {
  /**
   * @description
   * Prepares DeviationModel object to output for client.
   *
   * @param {DeviationMetadataSumModel} deviationMetadataSumStart
   * - The deviations metadata sum from start.
   * @param {DeviationMetadataSumModel} deviationMetadataSumEnd
   * - The deviations metadata sum from end.
   * @returns {Object} Object for client.
   */
  static prepareOutput(deviationMetadataSumStart, deviationMetadataSumEnd) {
    return {
      views: deviationMetadataSumEnd.views - deviationMetadataSumStart.views,
      favourites: deviationMetadataSumEnd.favourites - deviationMetadataSumStart.favourites,
      comments: deviationMetadataSumEnd.comments - deviationMetadataSumStart.comments,
      downloads: deviationMetadataSumEnd.downloads - deviationMetadataSumStart.downloads,
    };
  }
}
