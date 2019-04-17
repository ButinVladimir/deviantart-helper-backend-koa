/**
 * DAO config.
 */
export default class DaoConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {number} limitDeviationsBrowse - Limit to fetch deviations to browse from DAO.
   * @param {number} limitDeviationsStatistics
   * - Limit to fetch deviations to see statistics from DAO.
   */
  constructor(
    limitDeviationsBrowse,
    limitDeviationsStatistics,
  ) {
    this.limitDeviationsBrowse = limitDeviationsBrowse;
    this.limitDeviationsStatistics = limitDeviationsStatistics;
  }
}
