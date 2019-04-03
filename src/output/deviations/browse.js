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
   * @param {number} pagesCount - Count of pages with deviations for user.
   * @returns {Object} Object for client.
   */
  static prepareOutput(deviations, pagesCount) {
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
      pagesCount,
    };
  }
}
