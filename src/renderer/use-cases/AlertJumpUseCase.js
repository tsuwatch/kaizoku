import {UseCase} from 'almin';
import LiveFactory from '../domain/playlist/live/LiveFactory';
import playlistRepository from '../repositories/PlaylistRepository';

export default class AlertJumpUseCase extends UseCase {
  static create() {
    return new this({playlistRepository});
  }

  constructor({playlistRepository}) {
    super();

    this.playlistRepository = playlistRepository;
  }

  execute(info) {
    const playlist = this.playlistRepository.lastUsed();
    const live = LiveFactory.createWithAlertData(info);
    playlist.items.unshift(live);
    playlist.play(live.id);
    this.playlistRepository.save(playlist);
  }
}
