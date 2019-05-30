/**
 * DB config.
 */
export default class DbConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} configObject - The parsed JSON config.
   */
  constructor(
    configObject,
  ) {
    this.connectionString = configObject.connectionString;
    this.dbName = configObject.dbName;
  }
}
