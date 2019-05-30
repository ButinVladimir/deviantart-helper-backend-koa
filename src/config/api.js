/**
 * DeviantArt API config.
 */
export default class ApiConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} configObject - The parsed JSON config.
   */
  constructor(
    configObject,
  ) {
    this.limitDeviations = configObject.limitDeviations;
    this.limitDeviationsMetadata = configObject.limitDeviationsMetadata;
  }
}
