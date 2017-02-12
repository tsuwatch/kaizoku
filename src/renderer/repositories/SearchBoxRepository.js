import BaseRepository from './BaseRepository';

export class SearchBoxRepository extends BaseRepository {
  constructor() {
    super('search-box');
  }
}

export default new SearchBoxRepository();
