import {UseCase} from 'almin';
import AppLocator from '../AppLocator';
import searchBoxRepository from '../repositories/SearchBoxRepository';
import SearchLiveUseCase from './SearchLiveUseCase';
import ViewMyPageUseCase from './ViewMyPageUseCase';
import ViewRankingUseCase from './ViewRankingUseCase';

export default class RefreshPlaylistUseCase extends UseCase {
  static create() {
    return new this({searchBoxRepository});
  }

  constructor({searchBoxRepository}) {
    super();

    this.searchBoxRepository = searchBoxRepository;
  }

  execute() {
    const searchBox = this.searchBoxRepository.lastUsed();
    if (searchBox.isRequesting) return;
    if (searchBox.mode === 'search') {
      AppLocator.context.useCase(SearchLiveUseCase.create()).execute(searchBox);
    } else if (searchBox.mode === 'my') {
      AppLocator.context.useCase(ViewMyPageUseCase.create()).execute();
    } else if (searchBox.mode === 'user_ranking') {
      AppLocator.context.useCase(ViewRankingUseCase.create()).execute('user');
    } else if (searchBox.mode === 'official_ranking') {
      AppLocator.context.useCase(ViewRankingUseCase.create()).execute('official');
    }
  }
}
