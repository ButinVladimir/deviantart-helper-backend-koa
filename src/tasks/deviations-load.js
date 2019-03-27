import BaseTask from './base';
import GalleryApi from '../api/gallery';
import UserDao from '../dao/user';
import DeviationsDao from '../dao/deviations';
import Config from '../config/config';
import DeviationConverter from '../models/deviation/converter';
import { fetchUserInfoAndCheckAccessToken } from '../helper';

/**
 * Task to get all deviations from gallery by user.
 */
export default class DeviationsLoadTask extends BaseTask {
  /**
   * @description
   * The constructor.
   *
   * @param {Object} params - Task parameters.
   * @param {GalleryApi} galleryApi - DeviantArt gallery API.
   * @param {UserDao} userDao - The user DAO.
   * @param {DeviationsDao} deviationsDao - The deviations DAO.
   * @param {Config} config - The config.
   */
  constructor(params, galleryApi, userDao, deviationsDao, config) {
    super();

    this.setParams(params);

    this.galleryApi = galleryApi;
    this.userDao = userDao;
    this.deviationsDao = deviationsDao;
    this.config = config;
  }

  setParams({ userId, offset }) {
    this.userId = userId;
    this.offset = offset;
  }

  async run() {
    const userInfo = await fetchUserInfoAndCheckAccessToken(this.userId, this.userDao);

    const result = await this.galleryApi.getAll(
      userInfo.accessToken,
      this.offset,
      this.config.apiLimitDeviationsBrowse,
    );

    console.log('Got deviations for', userInfo.userName);
    console.log('Has more', result.has_more);
    console.log('Next offset', result.next_offset);

    const deviations = result.results.map(d => DeviationConverter.fromApiObject(d));
    await this.deviationsDao.batchUpdate(deviations);
  }
}
