import {
  NOT_STARTED,
  STARTED,
  FINISHED,
  FAILED,
} from '../../consts/task-states';

/**
 * Task model object.
 */
export default class TaskModel {
  /**
   * @description
   * The constructor.
   */
  constructor() {
    this.id = '';
    this.state = NOT_STARTED;
    this.name = '';
    this.params = {};
    this.creationTime = 0;
    this.startTime = 0;
    this.finishTime = 0;
  }

  /**
   * @description
   * Sets task state to not started and updates creation time.
   *
   * @returns {TaskModel} Self.
   */
  setNotStartedState() {
    this.state = NOT_STARTED;
    this.creationTime = Date.now();

    return this;
  }

  /**
   * @description
   * Sets task state to started and updates start time.
   *
   * @returns {TaskModel} Self.
   */
  setStartedState() {
    this.state = STARTED;
    this.startTime = Date.now();

    return this;
  }

  /**
   * @description
   * Sets task state to finished and updates finish time.
   *
   * @returns {TaskModel} Self.
   */
  setFinishedState() {
    this.state = FINISHED;
    this.finishTime = Date.now();

    return this;
  }

  /**
   * @description
   * Sets task state to failed and updates finish time.
   *
   * @returns {TaskModel} Self.
   */
  setFailedState() {
    this.state = FAILED;
    this.finishTime = Date.now();

    return this;
  }
}
