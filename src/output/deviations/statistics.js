import DeviationModel from '../../models/deviation/deviation';
import DeviationMetadataModel from '../../models/deviation-metadata/deviation-metadata';
import DeviationsMetadataOutput from './metadata';

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
   * @param {number} pageCount - Count of pages with deviations for user.
   * @returns {Object} Object for client.
   */
  static prepareOutput(deviations, metadata, pageCount) {
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
        nsfw: d.nsfw,
      })),
      metadata: metadata ? DeviationsMetadataOutput.prepareMetadata(metadata) : null,
      pageCount,
    };
  }
}
