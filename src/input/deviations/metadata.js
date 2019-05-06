/**
 * Input for 'deviations/metadata' route.
 */
export default class DeviationsMetadataInput {
  constructor() {
    this.deviationIds = [];
    this.timestampBegin = null;
    this.timestampEnd = null;
  }
}
