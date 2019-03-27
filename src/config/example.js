import Config from './config';
import { ENVIRONMENT_DEVELOPMENT } from '../consts/environments';

const config = new Config(
  8000, // Port
  'path/to/mongodb/instance', // MongoDB connection string
  'db', // MongoDB DB name
  'secretCookieKey', // Cookie key
  'oauthKey', // DeviantArt OAuth key
  'oauthSecret', // DeviantArt OAuth secret
  'path/to/server/connect/deviantart/callback', // DeviantArt OAuth callback URI
  80 * 24 * 60 * 60 * 1000, // DeviantArt OAuth refresh token window
  10, // Limit of deviations per page got from DeviantArt API, 1-24
  30, // Limit of deviations per page got from DAO
  ENVIRONMENT_DEVELOPMENT, // Environment
);

export default config;
