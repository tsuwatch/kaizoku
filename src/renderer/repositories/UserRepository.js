import BaseRepository from './BaseRepository';

export class UserRepository extends BaseRepository {
  constructor() {
    super('user');
  }
}

export default new UserRepository();
