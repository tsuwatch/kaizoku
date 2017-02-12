import {UseCase} from 'almin';
import playlistRepository from '../repositories/PlaylistRepository';

export default class ControlPlayerUseCase extends UseCase {
  static create() {
    return new this({playlistRepository});
  }

  constructor({playlistRepository}) {
    super();

    this.playlistRepository = playlistRepository;
  }

  execute(operation, itemId) {
    const playlist = this.playlistRepository.lastUsed();
    if (operation === 'play') {
      playlist.play(itemId);
    } else if (operation === 'stop') {
      playlist.stop();
    } else if (operation === 'forward') {
      playlist.playNext();
    } else if (operation === 'backward') {
      playlist.playPrev();
    }
    this.playlistRepository.save(playlist);
  }
}
