/**
 * Task scheduler config.
 */
export default class SchedulerConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {boolean} readOnly - Should user be able to request data fetching.
   * @param {number} maxAttempts - Number of max attempts per task for scheduler.
   * @param {number} minDelay - Minimal scheduler delay.
   * @param {number} maxDelay - Maximal scheduler delay.
   * @param {number} successDelayCoefficient
   * - Coefficient by which scheduler delay will be multiplied if task run has been successful.
   * @param {number} failureDelayCoefficient
   * - Coefficient by which scheduler delay will be multiplied if task run has failed.
   */
  constructor(
    readOnly,
    maxAttempts,
    minDelay,
    maxDelay,
    successDelayCoefficient,
    failureDelayCoefficient,
  ) {
    this.readOnly = readOnly;
    this.maxAttempts = maxAttempts;
    this.minDelay = minDelay;
    this.maxDelay = maxDelay;
    this.successDelayCoefficient = successDelayCoefficient;
    this.failureDelayCoefficient = failureDelayCoefficient;
  }
}
