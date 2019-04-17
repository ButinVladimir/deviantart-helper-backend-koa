import * as sort from '../../consts/sort';

/**
 * Input for 'deviations/statistics' route.
 */
export default class DeviationsStatisticsInput {
  constructor() {
    this.publishedTimeBegin = null;
    this.publishedTimeEnd = null;
    this.title = null;
    this.sortField = sort.FIELD_PUBLISHED_TIME;
    this.sortOrder = sort.ORDER_DESC;
    this.timestampBegin = null;
    this.timestampEnd = null;
  }
}
