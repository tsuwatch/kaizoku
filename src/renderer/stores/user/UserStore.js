import {Store} from 'almin';
import UserState from './UserState';

export default class UserStore extends Store {
  constructor(userRepository) {
    super();

    this.state = new UserState();

    userRepository.onChange(user => {
      const newState = new UserState(user);
      if (this.state !== newState) {
        this.state = newState;
        this.emitChange();
      }
    });
  }

  getState() {
    return {
      user: this.state
    }
  }
}
