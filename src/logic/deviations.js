import UserDao from '../dao/user';
import DeviationsDao from '../dao/deviations';
import DeviationsMetadataDao from '../dao/deviations-metadata';
import Config from '../config/config';
import DeviationsBrowseInput from '../input/deviations/browse';
import DeviationsDetailsInput from '../input/deviations/details';
import DeviationsMetadataInput from '../input/deviations/metadata';
import DeviationsStatisticsInput from '../input/deviations/statistics';
import DeviationsTotalInput from '../input/deviations/total';
import DeviationsBrowseOutput from '../output/deviations/browse';
import DeviationsDetailsOutput from '../output/deviations/details';
import DeviationsMetadataOutput from '../output/deviations/metadata';
import DeviationsStatisticsOutput from '../output/deviations/statistics';
import DeviationsTotalOutput from '../output/deviations/total';

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
   * @param {DeviationsMetadataDao} deviationsMetadataDao - Deviations metadata DAO.
   * @param {Config} config - Config.
   */
  constructor(userDao, deviationsDao, deviationsMetadataDao, config) {
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.deviationsMetadataDao = deviationsMetadataDao;
    this.config = config;
  }

  /**
   * @description
   * Fetches all deviations for user.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsBrowseInput} input - The input.
   * @param {number} page - Current page.
   * @returns {Object[]} Deviations.
   */
  async browse(userId, input, page) {
    const deviations = await this.deviationsDao.getThumbnailsByUser(
      userId,
      input,
      page * this.config.daoConfig.limitDeviationsBrowse,
      this.config.daoConfig.limitDeviationsBrowse,
    );
    const pageCount = Math.ceil(
      (await this.deviationsDao.getCountByUser(userId, input))
        / this.config.daoConfig.limitDeviationsBrowse,
    );

    return DeviationsBrowseOutput.prepareOutput(deviations, pageCount);
  }

  /**
   * @description
   * Fetches deviation with details for user.
   *
   * @param {string} userId - The user ID.
   * @param {string} deviationId - The deviation ID.
   * @param {DeviationsDetailsInput} input - The input.
   * @returns {Object} Deviation details.
   */
  async details(userId, deviationId, input) {
    const deviation = await this.deviationsDao.getByIdAndUser(
      userId,
      deviationId,
    );

    if (deviation === null) {
      return null;
    }

    const metadata = input.metadata
      ? await this.deviationsMetadataDao.getByIdAndUser(userId, deviationId, input)
      : null;

    return DeviationsDetailsOutput.prepareOutput(deviation, metadata);
  }

  /**
   * @description
   * Fetches deviations metadata for user.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsMetadataInput} input - The input.
   * @returns {Object} Metadata.
   */
  async metadata(userId, input) {
    const metadata = input.deviationIds
      ? await this.deviationsMetadataDao
        .getByIdsAndUser(userId, input.deviationIds, input)
      : [];

    return DeviationsMetadataOutput.prepareOutput(metadata);
  }

  /**
   * @description
   * Fetches deviations statistics for user.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsStatisticsInput} input - The input.
   * @param {number} page - Current page.
   * @returns {Object} Deviations statistics.
   */
  async statistics(userId, input, page) {
    const deviations = await this.deviationsDao.getStatisticsByUser(
      userId,
      input,
      page * this.config.daoConfig.limitDeviationsStatistics,
      this.config.daoConfig.limitDeviationsStatistics,
    );

    let metadata = null;
    if (input.metadata) {
      metadata = deviations.length > 0
        ? await this.deviationsMetadataDao.getByIdsAndUser(
          userId,
          deviations.map(d => d.id),
          input,
        )
        : [];
    }

    const pageCount = Math.ceil(
      (await this.deviationsDao.getCountByUser(userId, input))
        / this.config.daoConfig.limitDeviationsStatistics,
    );

    return DeviationsStatisticsOutput.prepareOutput(deviations, metadata, pageCount);
  }

  /**
   * @description
   * Fetches deviations total statistics for user.
   *
   * @param {string} userId - The user ID.
   * @param {DeviationsTotalInput} input - The input.
   * @returns {Object} Deviations total statistics.
   */
  async totalStatistics(userId, input) {
    const statistics = await this.deviationsDao.getTotalStatisticsByUser(
      userId,
      input,
    );

    return DeviationsTotalOutput.prepareOutput(statistics);
  }
}
