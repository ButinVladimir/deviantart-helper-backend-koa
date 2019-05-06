import DeviationModel from '../../models/deviation/deviation';
import DeviationMetadataModel from '../../models/deviation-metadata/deviation-metadata';

/**
 * Class to prepare output for 'deviations/statistics' route.
 */
export default class DeviationsStatisticsOutput {
  /**
   * @description
   * Prepares DeviationModel, DeviationMetadataModel objects
   * and pagination parameters to output for client.
   *
   * @param {DeviationModel[]} deviations - DeviationModel instances.
   * @param {DeviationMetadataModel[]} metadata - Instances of DeviationMetadataModel.
   * @returns {Object} Object for client.
   */
  static prepareOutput(deviations, metadata) {
    return {
      deviations: deviations.map(d => ({
        id: d.id,
        title: d.title,
        url: d.url,
        publishedTime: d.publishedTime,
        thumbnail: d.thumbnail,
        views: d.views,
        comments: d.comments,
        favourites: d.favourites,
        downloads: d.downloads,
      })),
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
