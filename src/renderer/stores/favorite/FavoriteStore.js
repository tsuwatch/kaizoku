import {Store} from 'almin';
import FavoriteState from './FavoriteState';

export default class FavoriteStore extends Store {
  constructor(favoriteRepository) {
    super();

    this.state = new FavoriteState();

    favoriteRepository.onChange(favorite => {
      const newState = new FavoriteState(favorite);
      if (this.state !== newState) {
        this.state = newState;
        this.emitChange();
      }
    });
  }

  getState() {
    return {
      favorite: this.state
    }
  }
}
