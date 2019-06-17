import DeviationModel from '../../models/deviation/deviation';
import DeviationMetadataModel from '../../models/deviation-metadata/deviation-metadata';

/**
 * Class to prepare output for 'deviations/details' route.
 */
export default class DeviationsDetailsOutput {
  /**
   * @description
   * Prepares DeviationModel and DeviationMetadataModel objects to output for client.
   *
   * @param {DeviationModel} deviation - DeviationModel instance.
   * @param {DeviationMetadataModel[]} metadata - Instances of DeviationMetadataModel.
   * @returns {Object} Object for client.
   */
  static prepareOutput(deviation, metadata) {
    return {
      deviation: {
        title: deviation.title,
        thumbnail: deviation.thumbnail,
        preview: deviation.preview,
        url: deviation.url,
        publishedTime: deviation.publishedTime,
        description: deviation.description,
        views: deviation.views,
        favourites: deviation.favourites,
        comments: deviation.comments,
        downloads: deviation.downloads,
        nsfw: deviation.nsfw,
      },
      metadata: metadata
        ? metadata.map(dm => ([
          dm.timestamp,
          dm.views,
          dm.comments,
          dm.favourites,
          dm.downloads,
        ]))
        : null,
    };
  }
}
