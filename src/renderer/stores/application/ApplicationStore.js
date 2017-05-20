import {Store} from 'almin';
import ApplicationState from './ApplicationState';

export default class ApplicationStore extends Store {
  constructor(applicationRepository) {
    super();

    this.state = new ApplicationState();

    applicationRepository.onChange(application => {
      const newState = new ApplicationState(application);
      if (this.state !== newState) {
        this.state = newState;
        this.emitChange();
      }
    });
  }

  getState() {
    return {
      application: this.state
    }
  }
}
