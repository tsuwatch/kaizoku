import {UseCase} from 'almin';
import {Live} from 'niconico-search';
import LiveFactory from '../domain/playlist/live/LiveFactory';
import applicationRepository from '../repositories/ApplicationRepository';
import playlistRepository from '../repositories/PlaylistRepository';
import searchBoxRepository from '../repositories/SearchBoxRepository';

export default class SearchLiveUseCase extends UseCase {
  static create() {
    return new this({applicationRepository, playlistRepository, searchBoxRepository});
  }

  constructor({applicationRepository, playlistRepository, searchBoxRepository}) {
    super();

    this.client = new Live('Kaizoku');
    this.applicationRepository = applicationRepository;
    this.playlistRepository = playlistRepository;
    this.searchBoxRepository = searchBoxRepository;
  }

  execute({word, type, sort} = {}) {
    const application = this.applicationRepository.lastUsed();
    const playlist = this.playlistRepository.lastUsed();
    const searchBox = this.searchBoxRepository.lastUsed();
    searchBox.word = word;
    searchBox.type = type;
    searchBox.sort = sort ? sort : searchBox.sort;
    searchBox.mode = 'search';
    if (!searchBox.word) {
      playlist.items = [];
      this.playlistRepository.save(playlist);
      this.searchBoxRepository.save(searchBox);
      return;
    }

    const options = {
      'filters[liveStatus][0]': 'onair',
      '_sort': searchBox.sort
    };
    if (searchBox.type === 'tag') options['targets'] = 'tagsExact';
    searchBox.isRequesting = true;
    this.searchBoxRepository.save(searchBox);

    this.client.search(searchBox.word, options).then(response => {
      const resultItems = response.data.data.map(data => {
        return LiveFactory.createWithApiData(data);
      });
      const filteredItems = resultItems.filter(item => !playlist.pinnedItems().map(item => item.id).includes(item.id));
      const items = [...playlist.pinnedItems(), ...filteredItems];
      if (playlist.currentItem()) {
        const index = items.findIndex(item => item.id === playlist.currentItemId);
        if (index !== -1) {
          items.splice(index, 1);
          items.splice(index, 0, playlist.currentItem());
        } else {
          items.unshift(playlist.currentItem());
        }
      }
      playlist.items = items;
      searchBox.isRequesting = false;
      application.commentViewer = false;
      this.applicationRepository.save(application);
      this.searchBoxRepository.save(searchBox);
      this.playlistRepository.save(playlist);
    });
  }
}
