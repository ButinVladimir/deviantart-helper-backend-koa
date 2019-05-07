import * as sort from '../../consts/sort';

/**
 * Input for 'deviations/browse' route.
 */
export default class DeviationsBrowseInput {
  constructor() {
    this.deviationIds = null;
    this.publishedTimeBegin = null;
    this.publishedTimeEnd = null;
    this.title = null;
    this.sortField = sort.FIELD_PUBLISHED_TIME;
    this.sortOrder = sort.ORDER_DESC;
    this.nsfw = null;
  }
}
