import {UseCase} from 'almin';
import {Live} from 'niconico-search';
import LiveFactory from '../domain/playlist/live/LiveFactory';
import playlistRepository from '../repositories/PlaylistRepository';
import searchBoxRepository from '../repositories/SearchBoxRepository';

export default class SearchLiveUseCase extends UseCase {
  static create() {
    return new this({playlistRepository, searchBoxRepository});
  }

  constructor({playlistRepository, searchBoxRepository}) {
    super();

    this.client = new Live('nicomentron');
    this.playlistRepository = playlistRepository;
    this.searchBoxRepository = searchBoxRepository;
  }

  execute({word, type, sort} = {}) {
    const playlist = this.playlistRepository.lastUsed();
    const searchBox = this.searchBoxRepository.lastUsed();
    searchBox.word = word;
    searchBox.type = type;
    searchBox.sort = sort ? sort : searchBox.sort;
    searchBox.mode = 'search';
    if (!searchBox.word) return;

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
      if (playlist.currentItem() && !items.find(item => item.id === playlist.currentItemId)) items.unshift(playlist.currentItem());
      playlist.items = items;
      searchBox.isRequesting = false;
      this.searchBoxRepository.save(searchBox);
      this.playlistRepository.save(playlist);
    });
  }
}
