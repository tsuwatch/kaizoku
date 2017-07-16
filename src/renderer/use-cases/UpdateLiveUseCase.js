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
    const stream = status.stream;
    live.title = stream.title;
    if (!live.description) live.description = stream.description;
    live.startTime = Number(`${stream.open_time}000`);
    live.commentCounter = stream.comment_count;
    live.viewCounter = stream.watch_count;
    playlist.items[index] = live;
    this.playlistRepository.save(playlist);
  }
}
