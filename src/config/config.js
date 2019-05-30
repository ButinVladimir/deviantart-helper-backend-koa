import ServerConfig from './server';
import DbConfig from './db';
import OAuthConfig from './oauth';
import SchedulerConfig from './scheduler';
import ApiConfig from './api';
import DaoConfig from './dao';
import RateLimitConfig from './rate-limit';

/**
 * Config.
 */
export default class Config {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} configObject - The parsed JSON config.
   */
  constructor(
    configObject,
  ) {
    this.serverConfig = new ServerConfig(configObject.server);
    this.dbConfig = new DbConfig(configObject.db);
    this.oauthConfig = new OAuthConfig(configObject.oauth);
    this.schedulerConfig = new SchedulerConfig(configObject.scheduler);
    this.apiConfig = new ApiConfig(configObject.api);
    this.daoConfig = new DaoConfig(configObject.dao);
    this.rateLimitConfig = new RateLimitConfig(configObject.rateLimit);
    this.environment = configObject.environment;
  }
}
