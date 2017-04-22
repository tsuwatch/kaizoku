import {UseCase} from 'almin';
import {ipcRenderer} from 'electron'
import favoriteRepository from '../repositories/FavoriteRepository';
import searchBoxRepository from '../repositories/SearchBoxRepository';

export default class FavoriteSearchConditionUseCase extends UseCase {
  static create() {
    return new this({favoriteRepository, searchBoxRepository});
  }

  constructor({favoriteRepository, searchBoxRepository}) {
    super();

    this.favoriteRepository = favoriteRepository;
    this.searchBoxRepository = searchBoxRepository;
  }

  execute(isFavorite) {
    const favorite = this.favoriteRepository.lastUsed();
    const searchBox = this.searchBoxRepository.lastUsed();

    if (isFavorite) {
      favorite.add(searchBox);
    } else {
      favorite.remove(searchBox);
    }
    ipcRenderer.send('RequestStore', { name: 'favorite', data: favorite});
    this.favoriteRepository.save(favorite);
  }
}
