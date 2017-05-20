import {StoreGroup} from 'almin';
import ApplicationStore from './application/ApplicationStore';
import PlaylistStore from './playlist/PlaylistStore';
import SearchBoxStore from './search-box/SearchBoxStore';
import FavoriteStore from './favorite/FavoriteStore';

import applicationRepository from '../repositories/ApplicationRepository';
import playlistRepository from '../repositories/PlaylistRepository';
import searchBoxRepository from '../repositories/SearchBoxRepository';
import favoriteRepository from '../repositories/FavoriteRepository';

export default class AppStoreGroup {
  static create() {
    return new StoreGroup([
      new ApplicationStore(applicationRepository),
      new PlaylistStore(playlistRepository),
      new SearchBoxStore(searchBoxRepository),
      new FavoriteStore(favoriteRepository)
    ]);
  }
}
