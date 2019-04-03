import * as sort from '../../consts/sort';

/**
 * Filter for 'deviations/browse' route.
 */
export default class DeviationsBrowseFilter {
  constructor() {
    this.publishedTimeBegin = null;
    this.publishedTimeEnd = null;
    this.title = null;
    this.sortField = sort.FIELD_PUBLISHED_TIME;
    this.sortOrder = sort.ORDER_DESC;
  }
}
