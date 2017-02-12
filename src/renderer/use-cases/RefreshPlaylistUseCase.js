import {UseCase} from 'almin';
import {Live} from 'niconico-search';
import LiveFactory from '../domain/playlist/live/LiveFactory';
import playlistRepository from '../repositories/PlaylistRepository';
import searchBoxRepository from '../repositories/SearchBoxRepository';

export default class RefreshPlaylistUseCase extends UseCase {
  static create() {
    return new this({playlistRepository, searchBoxRepository});
  }

  constructor({playlistRepository, searchBoxRepository}) {
    super();

    this.client = new Live('nicomentron');
    this.playlistRepository = playlistRepository;
    this.searchBoxRepository = searchBoxRepository;
  }

  execute() {
    const playlist = this.playlistRepository.lastUsed();
    const searchBox = this.searchBoxRepository.lastUsed();
    if (!searchBox.word) return;

    const options = {
      'filters[liveStatus][0]': 'onair',
      '_sort': searchBox.sort
    };
    if (searchBox.type === 'tag') options['targets'] = 'tagsExact';
    searchBox.isRequesting = true;
    this.searchBoxRepository.save(searchBox);

    this.client.search(searchBox.word, options).then(response => {
      const items = response.data.data.map(data => {
        return LiveFactory.createWithApiData(data);
      });
      if (playlist.currentItem() && !items.find(item => item.id === playlist.currentItemId)) items.unshift(playlist.currentItem());
      playlist.items = items;
      searchBox.isRequesting = false;
      this.searchBoxRepository.save(searchBox);
      this.playlistRepository.save(playlist);
    });
  }
}
