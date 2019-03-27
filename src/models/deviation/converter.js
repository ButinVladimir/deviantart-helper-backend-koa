import Deviation from './deviation';

/**
 * Class to convert object from and into the Deviation objects.
 */
export default class DeviationConverter {
  /**
   * @description
   * Converts API object to Deviation.
   *
   * @param {Object} apiObject - Object from API.
   * @returns {Deviation} - Deviation object.
   */
  static fromApiObject(apiObject) {
    const deviation = new Deviation();

    deviation.id = apiObject.deviationid;
    deviation.userId = apiObject.author.userid;
    deviation.title = apiObject.title;
    deviation.url = apiObject.url;
    deviation.publishedTime = Number.parseInt(apiObject.published_time, 10);
    if (apiObject.thumbs && apiObject.thumbs.length > 0) {
      deviation.thumbnail = {
        src: apiObject.thumbs[0].src,
        width: apiObject.thumbs[0].width,
        height: apiObject.thumbs[0].height,
      };
    }

    return deviation;
  }

  /**
   * @description
   * Converts Deviation to DB object.
   *
   * @param {Deviation} deviation - Deviation instance.
   * @returns {Object} DB object.
   */
  static toDbObject(deviation) {
    return {
      userId: deviation.userId,
      title: deviation.title,
      url: deviation.url,
      publishedTime: deviation.publishedTime,
      thumbnail: deviation.thumbnail,
    };
  }

  /**
   * @description
   * Converts DB object to Deviation.
   *
   * @param {Object} dbObject - DB object.
   * @returns {Deviation} Deviation instance.
   */
  static fromDbObject(dbObject) {
    const deviation = new Deviation();

    // eslint-disable-next-line no-underscore-dangle
    deviation.id = dbObject._id;
    deviation.userId = dbObject.userId;
    deviation.title = dbObject.title;
    deviation.url = dbObject.url;
    deviation.publishedTime = dbObject.publishedTime;
    deviation.thumbnail = dbObject.thumbnail;

    return deviation;
  }

  /**
   * @description
   * Converts Deviation into object for client.
   *
   * @param {Deviation} deviation - Deviation instance.
   * @returns {Object} Object for client.
   */
  static toClientObject(deviation) {
    return {
      id: deviation.id,
      title: deviation.title,
      url: deviation.url,
      publishedTime: deviation.publishedTime,
      thumbnail: deviation.thumbnail,
    };
  }
}
