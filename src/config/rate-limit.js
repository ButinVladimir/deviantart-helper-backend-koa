/**
 * Rate limit config.
 */
export default class RateLimitConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} configObject - The parsed JSON config.
   */
  constructor(
    configObject,
  ) {
    this.interval = configObject.interval;
    this.max = configObject.max;
    this.delayAfter = configObject.delayAfter;
    this.timeWait = configObject.timeWait;
  }
}
