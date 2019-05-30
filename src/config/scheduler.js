/**
 * Task scheduler config.
 */
export default class SchedulerConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} configObject - The parsed JSON config.
   */
  constructor(
    configObject,
  ) {
    this.readOnly = configObject.readOnly;
    this.maxAttempts = configObject.maxAttempts;
    this.minDelay = configObject.minDelay;
    this.maxDelay = configObject.maxDelay;
    this.successDelayCoefficient = configObject.successDelayCoefficient;
    this.failureDelayCoefficient = configObject.failureDelayCoefficient;
    this.fetchDataWindow = configObject.fetchDataWindow;
    this.requestFetchDataWindow = configObject.requestFetchDataWindow;
  }
}
