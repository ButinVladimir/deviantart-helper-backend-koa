import ServerConfig from './server';
import DbConfig from './db';
import OAuthConfig from './oauth';
import SchedulerConfig from './scheduler';
import ApiConfig from './api';
import DaoConfig from './dao';

/**
 * Config.
 */
export default class Config {
  /**
   * @description
   * The constructor.
   *
   * @param {ServerConfig} serverConfig - The server config.
   * @param {DbConfig} dbConfig - The DB config.
   * @param {OAuthConfig} oauthConfig - The OAuth config.
   * @param {SchedulerConfig} schedulerConfig - The task scheduler config.
   * @param {ApiConfig} apiConfig - The DeviantArt API config.
   * @param {DaoConfig} daoConfig - The DAO config.
   * @param {string} environment - Environment, development or production.
   */
  constructor(
    serverConfig,
    dbConfig,
    oauthConfig,
    schedulerConfig,
    apiConfig,
    daoConfig,
    environment,
  ) {
    this.serverConfig = serverConfig;
    this.dbConfig = dbConfig;
    this.oauthConfig = oauthConfig;
    this.schedulerConfig = schedulerConfig;
    this.apiConfig = apiConfig;
    this.daoConfig = daoConfig;
    this.environment = environment;
  }
}
