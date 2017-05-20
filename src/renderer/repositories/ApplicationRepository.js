import BaseRepository from './BaseRepository';

export class ApplicationRepository extends BaseRepository {
  constructor() {
    super('application');
  }
}

export default new ApplicationRepository();
