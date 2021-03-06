import DeviationModel from './deviation';
import DeviationMetadataModel from '../deviation-metadata/deviation-metadata';

/**
 * Class to convert object from and into the DeviationModel objects.
 */
export default class DeviationModelConverter {
  /**
   * @description
   * Converts API object to DeviationModel.
   *
   * @param {Object} apiObject - Object from API.
   * @returns {DeviationModel} - DeviationModel object.
   */
  static fromApiObject(apiObject) {
    const deviation = new DeviationModel();

    deviation.id = apiObject.deviationid;
    deviation.userId = apiObject.author.userid;
    deviation.title = apiObject.title;
    deviation.url = apiObject.url;
    deviation.publishedTime = Number.parseInt(apiObject.published_time, 10) * 1000;
    deviation.nsfw = apiObject.is_mature;

    if (apiObject.thumbs && apiObject.thumbs.length > 0) {
      deviation.thumbnail = {
        src: apiObject.thumbs[0].src,
        width: apiObject.thumbs[0].width,
        height: apiObject.thumbs[0].height,
      };
    }

    if (apiObject.preview) {
      deviation.preview = {
        src: apiObject.preview.src,
        width: apiObject.preview.width,
        height: apiObject.preview.height,
      };
    }

    return deviation;
  }

  /**
   * @description
   * Converts DeviationModel to DB object.
   *
   * @param {DeviationModel} deviation - DeviationModel instance.
   * @returns {Object} DB object.
   */
  static toDbObject(deviation) {
    return {
      userId: deviation.userId,
      title: deviation.title,
      url: deviation.url,
      publishedTime: deviation.publishedTime,
      thumbnail: deviation.thumbnail,
      preview: deviation.preview,
      nsfw: deviation.nsfw,
    };
  }

  /**
   * @description
   * Converts DeviationModel to DB object containing metadata.
   *
   * @param {DeviationModel} deviation - DeviationModel instance.
   * @returns {Object} DB object.
   */
  static toDbMetadataObject(deviation) {
    return {
      description: deviation.description,
      views: deviation.views,
      favourites: deviation.favourites,
      comments: deviation.comments,
      downloads: deviation.downloads,
    };
  }

  /**
   * @description
   * Converts DB object to DeviationModel.
   *
   * @param {Object} dbObject - DB object.
   * @returns {DeviationModel} DeviationModel instance.
   */
  static fromDbObject(dbObject) {
    const deviation = new DeviationModel();

    // eslint-disable-next-line no-underscore-dangle
    deviation.id = dbObject._id;
    deviation.userId = dbObject.userId;
    deviation.title = dbObject.title;
    deviation.url = dbObject.url;
    deviation.publishedTime = dbObject.publishedTime;
    deviation.thumbnail = dbObject.thumbnail;
    deviation.preview = dbObject.preview;
    deviation.description = dbObject.description;
    deviation.views = dbObject.views;
    deviation.favourites = dbObject.favourites;
    deviation.comments = dbObject.comments;
    deviation.downloads = dbObject.downloads;
    deviation.nsfw = dbObject.nsfw;

    return deviation;
  }

  /**
   * @description
   * Converts DeviationMetadataModel instance into the DeviationModel to update metadata.
   *
   * @param {DeviationMetadataModel} metadata - DeviationMetadataModel instance.
   * @returns {DeviationModel} DeviationModel instance.
   */
  static fromMetadata(metadata) {
    const deviation = new DeviationModel();

    deviation.id = metadata.deviationId;
    deviation.views = metadata.views;
    deviation.favourites = metadata.favourites;
    deviation.comments = metadata.comments;
    deviation.downloads = metadata.downloads;
    deviation.description = metadata.description;

    return deviation;
  }
}
