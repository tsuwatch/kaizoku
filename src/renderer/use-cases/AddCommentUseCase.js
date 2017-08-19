import {UseCase} from 'almin';
import playlistRepository from '../repositories/PlaylistRepository';

export default class AddCommentUseCase extends UseCase {
  static create() {
    return new this({playlistRepository});
  }

  constructor({playlistRepository}) {
    super();

    this.playlistRepository = playlistRepository;
  }

  execute(itemId, messageServer, comment) {
    if (comment.isEject()) return;

    // 広告など全ての部屋に来るコメントを間引く
    if (!comment.isUser() && ~~comment.attr.thread !== messageServer.thread) return;

    const playlist = this.playlistRepository.lastUsed();
    const index = playlist.items.findIndex(item => item.id === itemId);
    const live = playlist.items[index];
    if (live.comments.length === 500) live.comments = [];
    live.comments = live.comments.concat(comment);
    if (!live.firstComments[comment.attr.user_id]) {
      comment.isFirst = true;
      live.firstComments[comment.attr.user_id] = true;
    } 
    playlist.items[index] = live;
    this.playlistRepository.save(playlist);
  }
}
