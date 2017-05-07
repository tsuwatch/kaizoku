import {UseCase} from 'almin';
import playlistRepository from '../repositories/PlaylistRepository';

export default class UpdateLiveUseCase extends UseCase {
  static create() {
    return new this({playlistRepository});
  }

  constructor({playlistRepository}) {
    super();

    this.playlistRepository = playlistRepository;
  }

  execute(id, status) {
    const playlist = this.playlistRepository.lastUsed();
    const index = playlist.items.findIndex(item => item.id === id);
    const live = playlist.items[index];
    live.title = status.title;
    live.description = status.description;
    live.startTime = status.open_time;
    live.commentCounter = status.comment_count;
    live.viewCounter = status.watch_count;
    playlist.items[index] = live;
    this.playlistRepository.save(playlist);
  }
}
