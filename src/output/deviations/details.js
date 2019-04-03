import DeviationModel from '../../models/deviation/deviation';
import DeviationMetadataModel from '../../models/deviation-metadata/deviation-metadata';

/**
 * Class to prepare output for 'deviations/details' route.
 */
export default class DeviationsDetailsOutput {
  /**
   * @description
   * Prepares DeviationModel and pagination parameters to output for client.
   *
   * @param {DeviationModel} deviation - DeviationModel instance.
   * @param {DeviationMetadataModel[]} metadata - Instances of DeviationMetadataModel.
   * @returns {Object} Object for client.
   */
  static prepareOutput(deviation, metadata) {
    return {
      deviation: {
        title: deviation.title,
        preview: deviation.preview,
        url: deviation.url,
        publishedTime: deviation.publishedTime,
        views: deviation.views,
        comments: deviation.comments,
        favourites: deviation.favourites,
        downloads: deviation.downloads,
      },
      metadata: metadata.map(dm => ({
        timestamp: dm.timestamp,
        views: dm.views,
        comments: dm.comments,
        favourites: dm.favourites,
        downloads: dm.downloads,
      })),
    };
  }
}
