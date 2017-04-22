import {StoreGroup} from 'almin';
import PlaylistStore from './playlist/PlaylistStore';
import SearchBoxStore from './search-box/SearchBoxStore';
import FavoriteStore from './favorite/FavoriteStore';

import playlistRepository from '../repositories/PlaylistRepository';
import searchBoxRepository from '../repositories/SearchBoxRepository';
import favoriteRepository from '../repositories/FavoriteRepository';

export default class AppStoreGroup {
  static create() {
    return new StoreGroup([
      new PlaylistStore(playlistRepository),
      new SearchBoxStore(searchBoxRepository),
      new FavoriteStore(favoriteRepository)
    ]);
  }
}
