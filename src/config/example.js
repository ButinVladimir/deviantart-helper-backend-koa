import Config from './config';
import ServerConfig from './server';
import DbConfig from './db';
import OAuthConfig from './oauth';
import SchedulerConfig from './scheduler';
import ApiConfig from './api';
import DaoConfig from './dao';
import { ENVIRONMENT_DEVELOPMENT } from '../consts/environments';

const config = new Config(
  new ServerConfig(
    8000, // Port
    'secretCookieKey', // Cookie key
  ),
  new DbConfig(
    'path/to/mongodb/instance', // MongoDB connection string
    'db', // MongoDB DB name
  ),
  new OAuthConfig(
    'oauthKey', // DeviantArt OAuth key
    'oauthSecret', // DeviantArt OAuth secret
    'tokenKey', // Token encryption key
    'path/to/server/connect/deviantart/callback', // DeviantArt OAuth callback URI
    50 * 60 * 1000, // DeviantArt OAuth access token window
    80 * 24 * 60 * 60 * 1000, // DeviantArt OAuth refresh token window
  ),
  new SchedulerConfig(
    false, // Should user be able to request data fetching
    5, // Number of max attempts per task for task scheduler
    1000, // Minimal task scheduler delay
    600000, // Maximal task scheduler delay
    0.75, // Coefficient by which scheduler delay will be multiplied
    // if task run has been successful
    4, // Coefficient by which scheduler delay will be multiplied if task run has failed
    5 * 60 * 1000, // Window when user cannot fetch their data
    10 * 60 * 1000, // Window when user cannot request fetching their data
  ),
  new ApiConfig(
    10, // Limit of deviations per page got from DeviantArt API, 1-24
    10, // Limit of deviations metadata per page got from DeviantArt API, 1-10
  ),
  new DaoConfig(
    30, // Limit of deviations per page got from DAO to browse
    10, // Limit of deviations per page got from DAO to see statistics
  ),
  ENVIRONMENT_DEVELOPMENT, // Environment
);

export default config;
