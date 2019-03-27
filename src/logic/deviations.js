import UserDao from '../dao/user';
import DeviationsDao from '../dao/deviations';
import Config from '../config/config';
import DeviationConverter from '../models/deviation/converter';
import { fetchUserInfoAndCheckAccessToken } from '../helper';

/**
 * Logic for deviations part.
 */
export default class DeviationsLogic {
  /**
   * @description
   * The constructor.
   *
   * @param {UserDao} userDao - User DAO.
   * @param {DeviationsDao} deviationsDao - Deviations DAO.
   * @param {Config} config - Config.
   */
  constructor(userDao, deviationsDao, config) {
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.config = config;
  }

  /**
   * @description
   * Fetches all deviations for user.
   *
   * @param {string} userId - The user ID.
   * @param {number} offset - Current offset.
   * @returns {Object[]} Deviations.
   */
  async browse(userId, offset) {
    await fetchUserInfoAndCheckAccessToken(userId, this.userDao);

    const deviations = await this.deviationsDao.getByUser(
      userId,
      offset,
      this.config.daoLimitDeviationsBrowse,
    );

    return deviations.map(d => DeviationConverter.toClientObject(d));
  }
}
