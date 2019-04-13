/**
 * Deviation metadata model object.
 */
export default class DeviationMetadataModel {
  /**
   * @description
   * The constructor.
   */
  constructor() {
    this.deviationId = '';
    this.userId = '';
    this.timestamp = 0;
    this.description = '';
    this.views = 0;
    this.comments = 0;
    this.favourites = 0;
    this.downloads = 0;
  }

  /**
   * @description
   * Sets user ID.
   *
   * @param {string} userId - The user ID.
   * @returns {DeviationMetadataModel} - Self.
   */
  setUserId(userId) {
    this.userId = userId;

    return this;
  }
}
