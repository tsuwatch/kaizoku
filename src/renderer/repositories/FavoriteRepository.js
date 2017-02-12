import BaseRepository from './BaseRepository';

export class FavoriteRepository extends BaseRepository {
  constructor() {
    super('favorite');
  }
}

export default new FavoriteRepository();
