/**
 * DeviantArt API config.
 */
export default class ApiConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {number} limitDeviations - Limit to fetch deviations from API.
   * @param {number} limitDeviationsMetadata - Limit to fetch deviations metadata from API.
   */
  constructor(
    limitDeviations,
    limitDeviationsMetadata,
  ) {
    this.limitDeviations = limitDeviations;
    this.limitDeviationsMetadata = limitDeviationsMetadata;
  }
}
