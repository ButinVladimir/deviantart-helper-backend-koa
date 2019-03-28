import { NOT_STARTED, STARTED, FINISHED } from '../../consts/task-states';

/**
 * Task object.
 */
export default class Task {
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
   */
  setNotStartedState() {
    this.state = NOT_STARTED;
    this.creationTime = Date.now();
  }

  /**
   * @description
   * Sets task state to started and updates start time.
   */
  setStartedState() {
    this.state = STARTED;
    this.startTime = Date.now();
  }

  /**
   * @description
   * Sets task state to finished and updates finish time.
   */
  setFinishedState() {
    this.state = FINISHED;
    this.finishTime = Date.now();
  }
}
