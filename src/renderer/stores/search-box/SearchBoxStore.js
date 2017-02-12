import {Store} from 'almin';
import SearchBoxState from './SearchBoxState';

export default class SearchBoxStore extends Store {
  constructor(searchBoxRepository) {
    super();

    this.state = new SearchBoxState();
    searchBoxRepository.onChange(searchBox => {
      const newState = new SearchBoxState(searchBox);
      if (this.state !== newState) {
        this.state = newState;
        this.emitChange();
      }
    });
  }

  getState() {
    return {
      searchBox: this.state
    };
  }
}
