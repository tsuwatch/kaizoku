import {UseCase} from 'almin';
import {ipcRenderer} from 'electron';
import LiveFactory from '../domain/playlist/live/LiveFactory';
import cheerio from 'cheerio';
import request from 'request';
import searchBoxRepository from '../repositories/SearchBoxRepository';
import playlistRepository from '../repositories/PlaylistRepository';

export default class ViewMyPageUseCase extends UseCase {
  static create() {
    return new this({searchBoxRepository, playlistRepository});
  }

  constructor({searchBoxRepository, playlistRepository}) {
    super();

    this.searchBoxRepository = searchBoxRepository;
    this.playlistRepository = playlistRepository;
  }

  extractData(el) {
    const data = {};
    const link = el.find('h3 > a');
    data['id'] = link.attr('href').match(/lv[0-9]*/)[0];
    data['title'] = link.attr('title');
    data['communityIcon'] = el.find('a > img').attr('src');
    return data;
  }

  execute() {
    const searchBox = this.searchBoxRepository.lastUsed();
    const playlist = this.playlistRepository.lastUsed();
    searchBox.isRequesting = true;
    searchBox.mode = 'my';
    this.searchBoxRepository.save(searchBox);

    request({
      url: 'http://live.nicovideo.jp/my',
      headers: {
        cookie: `user_session=${ipcRenderer.sendSync('RequestGetCookie')}`
      }
    }, (err, res, body) => {
      const $ = cheerio.load(body);
      const favoriteList = $('#Favorite_list');

      const liveItems = favoriteList.find('#subscribeItemsWrap').children('.liveItems').children();
      const items = liveItems.map((i, el) => {
        return LiveFactory.createWithMyPageData(this.extractData($(el)));
      });

      const liveItemsList = favoriteList.find('#all_subscribeItemsWrap').children('.liveItems');
      const itemsList = liveItemsList.map((i, el) => {
        return $(el).children().map((j, el2) => {
          return LiveFactory.createWithMyPageData(this.extractData($(el2)));
        });
      });
      const items2 = itemsList.toArray().reduce((a, b) => {
        return a.toArray().concat(b.toArray());
      });

      playlist.items = [...items, ...items2];
      this.playlistRepository.save(playlist);
      searchBox.isRequesting = false;
      this.searchBoxRepository.save(searchBox);
    });
  }
}
