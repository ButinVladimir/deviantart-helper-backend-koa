/**
 * DB config.
 */
export default class DbConfig {
  /**
   * @description
   * The constructor.
   *
   * @param {string} connectionString - Connection string for MongoDB.
   * @param {string} dbName - MongoDB DB name.
   */
  constructor(
    connectionString,
    dbName,
  ) {
    this.connectionString = connectionString;
    this.dbName = dbName;
  }
}
