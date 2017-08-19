import {UseCase} from 'almin';
import applicationRepository from '../repositories/ApplicationRepository';
import playlistRepository from '../repositories/PlaylistRepository';

export default class ControlPlayerUseCase extends UseCase {
  static create() {
    return new this({applicationRepository, playlistRepository});
  }

  constructor({applicationRepository, playlistRepository}) {
    super();

    this.applicationRepository = applicationRepository;
    this.playlistRepository = playlistRepository;
  }

  execute(operation, itemId) {
    const application = this.applicationRepository.lastUsed();
    const playlist = this.playlistRepository.lastUsed();

    if (operation === 'play') {
      playlist.play(itemId);
    } else if (operation === 'stop') {
      playlist.stop();
      application.commentViewer = false;
    } else if (operation === 'forward') {
      playlist.playNext();
    } else if (operation === 'backward') {
      playlist.playPrev();
    }

    this.applicationRepository.save(application);
    this.playlistRepository.save(playlist);
  }
}
