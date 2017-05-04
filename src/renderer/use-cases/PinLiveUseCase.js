import {UseCase} from 'almin';
import playlistRepository from '../repositories/PlaylistRepository';

export default class PinLiveUseCase extends UseCase {
  static create() {
    return new this({playlistRepository});
  }

  constructor({playlistRepository}) {
    super();

    this.playlistRepository = playlistRepository;
  }

  execute(id) {
    const playlist = this.playlistRepository.lastUsed();
    const live = playlist.items.find(item => item.id === id);
    live.pinned = !live.pinned;
    this.playlistRepository.save(playlist);
  }
}
