import BaseTaskModelFactory from '../base-factory';
import { FETCH_DATA_ALL_USERS } from '../../../consts/task-names';
import TaskModel from '../task';

/**
 * @description
 * The factory which creates tasks to fetch data from DeviantArt API for all users.
 */
export default class FetchDataAllUsersTaskModelFactory extends BaseTaskModelFactory {
  /**
   * @override
   * @description
   * Creates TaskModel instance.
   *
   * @returns {TaskModel} TaskModel instance.
   */
  static createModel() {
    return super.createModelRaw(FETCH_DATA_ALL_USERS, {});
  }
}
