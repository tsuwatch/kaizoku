import {Store} from 'almin';
import PlaylistState from './PlaylistState';

export default class PlaylistStore extends Store {
  constructor(playlistRepository) {
    super();

    this.state = new PlaylistState();

    playlistRepository.onChange(playlist => {
      const newState = new PlaylistState(playlist);
      if (this.state !== newState) {
        this.state = newState;
        this.emitChange();
      }
    });
  }

  getState() {
    return {
      playlist: this.state
    };
  }
}
