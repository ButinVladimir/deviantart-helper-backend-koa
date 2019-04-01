/**
 * DAO config.
 */
export default class DaoConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {number} limitDeviationsBrowse - Limit to fetch deviations to browse from DAO.
   */
  constructor(
    limitDeviationsBrowse,
  ) {
    this.limitDeviationsBrowse = limitDeviationsBrowse;
  }
}
