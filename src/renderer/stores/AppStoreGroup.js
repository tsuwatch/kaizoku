import {StoreGroup} from 'almin';
import PlaylistStore from './playlist/PlaylistStore';
import SearchBoxStore from './search-box/SearchBoxStore';
import FavoriteStore from './favorite/FavoriteStore';
import UserStore from './user/UserStore';

import playlistRepository from '../repositories/PlaylistRepository';
import searchBoxRepository from '../repositories/SearchBoxRepository';
import favoriteRepository from '../repositories/FavoriteRepository';
import userRepository from '../repositories/UserRepository';

export default class AppStoreGroup {
  static create() {
    return new StoreGroup([
      new PlaylistStore(playlistRepository),
      new SearchBoxStore(searchBoxRepository),
      new FavoriteStore(favoriteRepository),
      new UserStore(userRepository)
    ]);
  }
}
