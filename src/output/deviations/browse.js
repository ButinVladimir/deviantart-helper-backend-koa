import DeviationModel from '../../models/deviation/deviation';

/**
 * Class to prepare output for 'deviations/browse' route.
 */
export default class DeviationsBrowseOutput {
  /**
   * @description
   * Prepares DeviationModel and pagination parameters to output for client.
   *
   * @param {DeviationModel[]} deviations - DeviationModel instances.
   * @param {number} pageCount - Count of pages with deviations for user.
   * @returns {Object} Object for client.
   */
  static prepareOutput(deviations, pageCount) {
    return {
      deviations: deviations.map(d => ({
        id: d.id,
        title: d.title,
        url: d.url,
        publishedTime: d.publishedTime,
        thumbnail: d.thumbnail,
        views: d.views,
        favourites: d.favourites,
        comments: d.comments,
        downloads: d.downloads,
        nsfw: d.nsfw,
      })),
      pageCount,
    };
  }
}
