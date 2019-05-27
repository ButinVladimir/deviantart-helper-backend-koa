import { NOT_LOGGINED } from '../../consts/user-states';

/**
 * Session model object.
 */
export default class SessionModel {
  /**
   * @description
   * The constructor.
   */
  constructor() {
    this.userId = null;
    this.state = NOT_LOGGINED;
    this.values = {};
  }
}
