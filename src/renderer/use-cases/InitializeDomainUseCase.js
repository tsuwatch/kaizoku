import {UseCase} from 'almin';
import {ipcRenderer} from 'electron';

import Application from '../domain/application/Application';
import Playlist from '../domain/playlist/Playlist';
import SearchBox from '../domain/search-box/SearchBox';
import Favorite from '../domain/favorite/Favorite';

import applicationRepository from '../repositories/ApplicationRepository';
import playlistRepository from '../repositories/PlaylistRepository';
import searchBoxRepository from '../repositories/SearchBoxRepository';
import favoriteRepository from '../repositories/FavoriteRepository';

export default class InitializeDomainUseCase extends UseCase {
  static create() {
    return new this({applicationRepository, playlistRepository, searchBoxRepository, favoriteRepository});
  }

  constructor({applicationRepository, playlistRepository, searchBoxRepository, favoriteRepository}) {
    super();

    this.applicationRepository = applicationRepository;
    this.playlistRepository = playlistRepository;
    this.searchBoxRepository = searchBoxRepository;
    this.favoriteRepository = favoriteRepository;
  }

  execute() {
    const application = new Application();
    const playlist = new Playlist();
    const searchBox = new SearchBox();

    const data = ipcRenderer.sendSync('RequestRestore', 'favorite');
    const favorite = new Favorite({'_items': data ? data._items : []});

    this.applicationRepository.save(application);
    this.playlistRepository.save(playlist);
    this.searchBoxRepository.save(searchBox);
    this.favoriteRepository.save(favorite);
  }
}
