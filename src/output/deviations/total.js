import DeviationModel from '../../models/deviation/deviation';

/**
 * Class to prepare output for 'deviations/total' route.
 */
export default class DeviationsTotalOutput {
  /**
   * @description
   * Prepares DeviationModel object to output for client.
   *
   * @param {DeviationModel} deviation - DeviationModel instance.
   * @returns {Object} Object for client.
   */
  static prepareOutput(deviation) {
    return {
      views: deviation.views,
      favourites: deviation.favourites,
      comments: deviation.comments,
      downloads: deviation.downloads,
    };
  }
}
