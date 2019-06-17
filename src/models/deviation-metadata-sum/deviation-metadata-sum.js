import DeviationMetadataModel from '../deviation-metadata/deviation-metadata';

/**
 * Deviation metadata sum model object.
 */
export default class DeviationMetadataSumModel {
  /**
   * @description
   * The constructor.
   */
  constructor() {
    this.id = null;
    this.userId = '';
    this.timestamp = 0;
    this.views = 0;
    this.favourites = 0;
    this.comments = 0;
    this.downloads = 0;
  }

  /**
   * @description
   * Adds devitaion metadata stats.
   *
   * @param {DeviationMetadataModel} metadata - The deviation metadata.
   */
  addStats(metadata) {
    this.views += metadata.views;
    this.favourites += metadata.favourites;
    this.comments += metadata.comments;
    this.downloads += metadata.downloads;
  }

  /**
   * @description
   * Sets the ID.
   *
   * @param {string} id - The deviation metadata sum ID.
   */
  setId(id) {
    this.id = id;
  }

  /**
   * @description
   * Sets user ID.
   *
   * @param {string} userId - The user ID.
   */
  setUserId(userId) {
    this.userId = userId;
  }

  /**
   * @description
   * Sets the timestamp.
   */
  setTimestamp() {
    this.timestamp = Date.now();
  }
}
