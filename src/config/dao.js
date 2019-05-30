/**
 * DAO config.
 */
export default class DaoConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} configObject - The parsed JSON config.
   */
  constructor(
    configObject,
  ) {
    this.limitDeviationsBrowse = configObject.limitDeviationsBrowse;
    this.limitDeviationsStatistics = configObject.limitDeviationsStatistics;
  }
}
