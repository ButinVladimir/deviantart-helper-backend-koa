/**
 * Deviation model object.
 */
export default class DeviationModel {
  /**
   * @description
   * The constructor.
   */
  constructor() {
    this.id = '';
    this.userId = '';
    this.title = '';
    this.url = '';
    this.publishedTime = 0;
    this.thumbnail = null;
    this.preview = null;
    this.description = '';
    this.views = 0;
    this.comments = 0;
    this.favourites = 0;
    this.downloads = 0;
    this.nsfw = false;
  }
}
