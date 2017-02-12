import BaseRepository from './BaseRepository';

export class PlaylistRepository extends BaseRepository {
  constructor() {
    super('player');
  }
}

export default new PlaylistRepository();
